<!DOCTYPE html>
<html lang="en">
 
<head>
    <title>运维平台首页</title>
 
 
    <link href="/static/vendor/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="/static/jumbotron-narrow.css" rel="stylesheet">
 
    <script src="/static/js/jquery-1.12.2.js"></script>
	<script src="/static/bootstrap.min.js"></script>

 	{% block css_files %}
	{% endblock %}

	{% block header_js_files %}
	{% endblock %}
	
</head>
 
<body>
 
    <div class="container">
        <div class="header">
            <nav>
                <ul class="nav nav-pills pull-right">
                    <li role="presentation" class=""><a href="/">首页</a>
                    </li>
                  
					
					{% if user %}
						<li role="presentation"><a href="/show_add_project">添加项目</a></li>
						<li role="presentation" class=""><a href="/projects">项目列表</a></li>
						<li role="presentation"><a href="/show_delete_project">删除项目</a></li>
						<li role="presentation" class=""><a href="/logout">退出</a></li>
					{% else %}
					  <li role="presentation"><a href="showSignIn">登录</a>
	                    </li>
	                    <li role="presentation"><a href="showSignUp">注册</a>
	                    </li>
				    {% endif %}
					
                </ul>
            </nav>
            <h3 class="text-muted">运维平台首页</h3>
        </div>
 
            {% block content %}
		    {% endblock %}
 
        
        <footer class="footer">
            <p>&copy; SMM 2016</p>
        </footer>
 
    </div>
	
    {% block footer_js_files %}
	{% endblock %}
	
	
</body>
 
</html>
