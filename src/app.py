#!/usr/bin/env python
# -*- coding: utf-8 -*-
import  sys
reload(sys)  # Reload does the trick!
sys.setdefaultencoding('UTF8')
import  os 
import  time
from    itertools import islice
from    functools import wraps
from subprocess import Popen, PIPE

from    flask import Flask, render_template, json, request, redirect, session
from    flask.ext.mysql import MySQL
from    werkzeug import generate_password_hash, check_password_hash
import  git

GIT_BASE_DIR = "/opt/webapp/base_architect/"
app = Flask(__name__)
mysql = MySQL()


# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'xxxxx'
app.config['MYSQL_DATABASE_PASSWORD'] = 'xxxx'
app.config['MYSQL_DATABASE_DB'] = 'xxxxx'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)
# set a secret key for the session
app.secret_key = 'why would I tell you my secret key?'



def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = session.get('user')
        if not user:
            if request.is_xhr:
                return json.dumps({"code":10003, "msg":"请登录"})
            else:
                return custom_render_template('error.html', error="请登录")
        return f(*args, **kwargs)
    return decorated


def do_response(code, msg, **data):
    response = {
        "code": code,
        "msg": msg,
        "data": data or dict()   
    }
    return json.dumps(response).decode('unicode-escape').encode('utf8')


def custom_render_template(template, **kw):
    user = session.get('user')
    kw["user"] = user
    return render_template(template, **kw)

@app.route("/")
def main():
    return custom_render_template('index.html')

@app.route('/showSignUp')
def showSignUp():
    return custom_render_template('signup.html')

@app.route('/signUp',methods=['POST','GET'])
def signUp():
    # read the posted values from the UI
    _name = request.form['inputName']
    _email = request.form['inputEmail']
    _password = request.form['inputPassword']

    # validate the received values
    if _name and _email and _password:
        conn = mysql.connect()
        cursor = conn.cursor()

        #_password = generate_password_hash(_password) 
        sql_string = 'insert into user (user_name, user_username, user_password) values("{}","{}","{}")' \
            .format(_name, _email, _password)
        cursor.execute(sql_string)

        data = cursor.fetchall()

        if len(data) is 0:
            conn.commit()
            return json.dumps({
                    'message': 'User created successfully !',
                    'success': True
                })
        else:
            return json.dumps({'error':str(data[0])})  
    else:
        return json.dumps({'error':'Enter the required fields'})     


@app.route('/showSignIn')
def showSignin():
    return custom_render_template('signin.html')

@app.route('/validateLogin',methods=['POST'])
def validateLogin():
    try:
        _username = request.form['inputEmail']
        _password = request.form['inputPassword']

        con = mysql.connect()
        cursor = con.cursor()
        #_password = generate_password_hash(_password) 
        #cursor.callproc('sp_validateLogin',(_username,))
        cursor.execute("select * from user where user_username=%s", (_username, ))
        data = cursor.fetchall()
        if len(data) > 0:
            print data, "-----data"
            if data[0][3]==_password:
                session['user'] = data[0][0]
                return redirect('/projects')
            else:
                return custom_render_template('error.html',error = '用户名或密码错误')
        else:
            return custom_render_template('error.html',error='用户名或密码错误')

    except Exception as e:
        return custom_render_template('error.html',error=str(e))
    finally:
        cursor.close()
        con.close()

@app.route('/projects')
@requires_auth
def userHome():
    return custom_render_template('projects.html')

@app.route('/logout')
def logout():
    session.pop('user',None)
    return redirect('/')

@app.route('/show_add_project')
@requires_auth
def showAddWish():
    return custom_render_template('show_add_project.html')

@app.route('/show_delete_project')
@requires_auth
def showDeleteWish():
    return custom_render_template('show_delete_project.html')

@app.route('/add_project',methods=['POST'])
@requires_auth
def add_project():
    try:
        _title = request.form['inputTitle']
        _link = request.form['inputLink']
        _name = request.form['inputName']
        _description = request.form['inputDescription']
        _user = session.get('user')

        try:
            r = git.Repo.clone_from(_link, GIT_BASE_DIR + "/" + _name)
        except Exception as e:
            print(str(e))
            return custom_render_template('error.html',error = '已存在目录' + _name)
        conn = mysql.connect()
        cursor = conn.cursor()
        sql_string = '''
            insert into project (name, title, link, description, create_time) 
            values(%s, %s, %s, %s, %s)
            '''
        cursor.execute(sql_string, (_name, _title, _link, _description, time.strftime('%Y-%m-%d %H:%M:%S')))

        data = cursor.fetchall()

        if len(data) == 0:
            conn.commit()
            return redirect('/projects')
        else:
            return custom_render_template('error.html',error = 'An error occurred!')

    except Exception as e:
        return custom_render_template('error.html',error = str(e))

@app.route('/delete_project', methods=['POST'])
@requires_auth
def delete_project():
    try:
	_name = request.form['inputName']
	conn = mysql.connect()
	cursor = conn.cursor()
	cursor.execute("select *  from  project   where name = %s ", (_name,))
	data = cursor.fetchall()
	if len(data) == 1:
		cursor.execute("delete   from  project where name = %s", (_name,))
                conn.commit()
		a = os.system("rm -rf %s/%s" %(GIT_BASE_DIR,_name,))
                return redirect('/projects')
	else:
		return custom_render_template('error.html', error='项目不存在!')
    except Exception as e:
        print(str(e))
        return custom_render_template('error.html',error = str(e))

@app.route('/get_project_list')
@requires_auth
def getWish():
    try:
        _user = session.get('user')

        con = mysql.connect()
        cursor = con.cursor()
        cursor.execute('select id, name, title, link, description, current from project;')
        wishes = cursor.fetchall()

        wishes_dict = []
        for wish in wishes:
            wish_dict = {
                    'id': wish[0],
                    'name': wish[1],
                    'title': wish[2],
					'link': wish[3],
                    'description': wish[4],
					'current': wish[5]}
            wishes_dict.append(wish_dict)

        return json.dumps(wishes_dict)
    except Exception as e:
        return custom_render_template('error.html', error = str(e))


@app.route('/list_commits')
@requires_auth
def listGitCommits():
    try:
        _user = session.get('user')
        project_id = request.args.get("project_id")

        con = mysql.connect()
        cursor = con.cursor()
        #_password = generate_password_hash(_password) 
        #cursor.callproc('sp_validateLogin',(_username,))
        cursor.execute("select id, name, current from project where id=%s", (project_id, ))
        data = cursor.fetchall()
        if len(data)==0:
            return json.dumps({"code":10000, "msg": "项目不存在"})
        
        name = data[0][1]
        current = data[0][2]
        repo = git.Repo(GIT_BASE_DIR + "/" + name)

        r=repo.iter_commits("master")
        commit_list = []
        for c in islice(r, 0, 10, 1):
            commit = {
                    'id': str(c),
                    "name": c.message,
                    "datetime": str(c.committed_datetime)
                    }
            commit_list.append(commit)

        data = {
            "code": 0,
            "msg" : "",
            "data": {
                "infos" : commit_list,
                "current": current
                
            }
        }
        return json.dumps(data)
    except Exception as e:
        return custom_render_template('error.html', error = str(e))
		


@app.route('/deploy_project',methods=['POST'])
@requires_auth
def deploy_project():
    try:
        project_id = request.form['project_id']
        version = request.form['current']
        con = mysql.connect()
        cursor = con.cursor()
        #_password = generate_password_hash(_password) 
        #cursor.callproc('sp_validateLogin',(_username,))
        cursor.execute("select id, name, current from project where id=%s", (project_id, ))
        data = cursor.fetchall()
        if len(data)==0:
            return json.dumps({"code":10000, "msg": "项目不存在"})
        
        name = data[0][1]
	try:
        	process = os.system('sh /home/scripts/choice_programm.sh'+' '+name+' '+version)
                print process
        	if process!=0:
                    print "deploy project failed,please connect administrator"
	            return do_response(10000, 'deploy_project failed,please connect administrator')
        except Exception as e:
		print e
		return do_response(10000, str(e))

	conn = mysql.connect()
        cursor = conn.cursor()
        sql_string = '''
            update project set current=%s where id=%s
            '''
        cursor.execute(sql_string, (version, project_id))

        data = cursor.fetchall()

        if len(data) is 0:
            conn.commit()
            return do_response(0, "发布成功")
        else:
            return do_response(10000, '服务器异常')

    except Exception as e:
        print(str(e))
        return do_response(10000, '请求异常').encode("utf8")

		
        
if __name__ == "__main__":
    app.run(port=80, host="xxxxxxxxxxxxx", debug=True)
