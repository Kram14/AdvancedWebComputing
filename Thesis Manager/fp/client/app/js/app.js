$(function() {

    var app = {
        init: function() {
            this.user = {};
            $('.menu-crud').addClass('hidden');
            $('.menu-user').addClass('hidden');
            $('.menu-loading').removeClass('hidden');
            $('.menu-user').addClass('hidden');
            $('.btn-login').addClass('hidden');

            $('.btn-login').attr('href', '/api/login?url=/');
            $('.btn-logout').attr('href','/api/logout?url=/');

            this.router = new Router();
            this.setEventListeners();
            this.getUser();

            Backbone.history.start({pushState: true});
        },

        setEventListeners: function() {
            var self = this;
            $('.menu-crud .item a').click(function(ev) {
                var $el = $(ev.target).closest('.item');

                $('.menu-crud .item').removeClass('active');
                $el.addClass("active");

                if ($el.hasClass('menu-list')) {
                    self.router.navigate('list', {trigger: true});
                }

                if ($el.hasClass('menu-create')) {
                    self.router.navigate('new', {trigger: true});
                }

            });

            $('.navbar-brand').click(function() {
                self.router.navigate('', {trigger: true});
				$('.fadegif').show();
            });
            $('.form-search').submit(function() {
                self.showList();
                self.search($('.search-input').val(), function(list) {
                    self.displayLoadedList(list);
                });
                return false;
            });
        },

        getUser: function() {
            var self = this;
            $.ajax({
                method: 'GET',
                url: '/api/users/me',
                success: function(me) {
                    // user is already signed in
                    console.log(me);
                    self.user = me;
                    self.showLogout();
                },

                error: function(err) {
                    console.log('you have not authenticated');
                    self.showLogin();
                }
            });
        },
        showLogin: function() {
           $('.menu-loading').addClass('hidden');
           $('.menu-user').addClass('hidden');
           $('.btn-login').removeClass('hidden');
        },
        showLogout: function() {
           $('.menu-crud').removeClass('hidden');
           $('.user-email').text(this.user.email);
           $('.menu-loading').addClass('hidden');
           $('.btn-login').addClass('hidden');
           $('.menu-user').removeClass('hidden');
        },
        showHome: function() {
			$('.fadegif').show();
            $('.app-content').html('');
        },
        showList: function() {
			$('.fadegif').hide();
            var $listTemplate = getTemplate('tpl-thesis-list');
            $('.app-content').html($listTemplate);
        },
        search: function(query, callback) {
			console.log('response', query);
			$.get('/api/search/?q=' + query, {
                returned_fields: JSON.stringify(['Title', 'Year'])
            }, 
			function(list) {
                callback(list);
            });
			$("#searchbox").val('');
		
        },
        getThesisByID: function(id, callback) {
            var object = {};
            $.get('/api/thesis/' + id, function(item) {
                callback(item);
            });
        },
        showThesis: function(thesis) {
            var self = this;
            var $viewTemplate = getTemplate('tpl-thesis-detail', thesis);
            $('.app-content').html($viewTemplate);
			
			//Back button
			$('#back-btn').click(function (event) {
                app.router.navigate('list', {trigger: true});
			});
			//------------

        },
        showForm: function(object) {
			$('.fadegif').hide();
			$('.fadegif').remove();
            var self = this;
            if (!object) {
                object = {};
            }
            var $formTemplate = getTemplate('tpl-thesis-form', object);
            $('.app-content').html($formTemplate);
            $('form').unbind('submit').submit(function(ev) {
                var thesisObject = {};
                var inputs = $('form').serializeArray();
                for (var i = 0; i < inputs.length; i++) {
                    thesisObject[inputs[i].name] = inputs[i].value;
                }
                self.save(thesisObject);
                return false;
            });
			
			//Back button
			$('#btn-back').click(function (event) {
                app.router.navigate('list', {trigger: true});
			});
			//----------------
			
			//Cancel button
			$('#btn-can').click(function (event) {
                app.router.navigate('', {trigger: true});
			});
			//----------------

        },
        loadAllThesis: function() {
            var self = this;
            setTimeout(function() {
                $.get('/api/thesis', function(res) {
                    self.displayLoadedList(res);
                });
            }, 200);
        },
        displayLoadedList: function(list) {
            console.log('response', list);
            //  use tpl-thesis-list-item to render each loaded list and attach it
			for (var i = 0; i < list.length; i++){
				$('.thesis-list').append(getTemplate('tpl-thesis-list-item', list[i]));
			}
			
			var linkClicked = false;
			
			$('.table tbody tr a').click(function (event) {
				linkClicked = true;
			});
			
			$('.table tbody tr').click(function (event) {
				if (!linkClicked){
					app.router.navigate('thesis-' + $(this).attr('data-id'), {trigger: true});
					$('.menu-create').removeClass('active');
					$('.menu-list').removeClass('active');
				} 
				else {
					app.router.navigate('edit-' + $(this).attr('data-id'), {trigger: true});
					linkClicked = false;
					$('.menu-create').removeClass('active');
					$('.menu-list').removeClass('active');
				}
			});
			
			/* ----Delete table row
			$('.table tbody tr td').live('click', function (event) {
				var $row = $(this).closest('tr');
				$(this).closest("tr").remove();
			}); */
	
			
        },
        save: function(object) {
            var self = this;
            var thesisObject = {};
			var inputs = $('form').serializeArray();
			for (var i = 0; i < inputs.length; i++) {
				thesisObject[inputs[i].name] = inputs[i].value;
			}
			
			if (thesisObject.Title.length != 0){
				$.post('api/thesis', object, function(res) {
				alert("Saved.");
                self.router.navigate('list', {trigger: true});
            });
				return false;
			}
			else{
				alert("No entry.");
			}
        }


    };

    function getTemplate(template_id, context) {
        var template, $template, markup;
        template = $('#' + template_id);
        $template = Handlebars.compile(template.html());
        markup = $template(context);
        return markup;

    }


    var Router = Backbone.Router.extend({
        routes: {
            '': 'onHome',
            'thesis-:id': 'onView',
            'new': 'onCreate',
            'edit-:id': 'onEdit',
            'search-:query': 'onSearch',
            'list': 'onList'
        },

       onHome: function() {
            app.showHome();
       },

       onView: function(id) {
           console.log('thesis id', id);
            app.getThesisByID(id, function(item) {
                app.showThesis(item);
                FB.XFBML.parse();
            });
       },

       onCreate: function() {
            app.showForm();
       },

       onEdit: function(id) {
            app.getThesisByID(id, function(item) {
                app.showForm(item);
            });
       },
	   
       onSearch: function(query) {
            app.showList();
            app.search(query, function(list) {
                app.displayLoadedList(list);
            });
       },

       onList: function() {
            app.showList();
            app.loadAllThesis();
       }

    });
    app.init();


});