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
            $('.form-search').unbind('submit').submit(function(ev) {
				$('.fadegif').hide();
                self.router.navigate('search?=' + $('.search-input').val(), {trigger: true});
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
		
		searchThesis: function(keyword){
            var self = this;
            var regexStatement = new RegExp(".*(" + keyword + ").*", "i");
            $.get('/api/thesis', function(obj){
               var sorted_list = $.grep(obj, function(thesis, index){
                    return regexStatement.test(thesis.Title);
               });
               if(sorted_list.length == 0){
                    alert('Sorry. Zero results');
               }
               else{
                    var $listTemplate = getTemplate('tpl-thesis-list');
                    $('.app-content').html($listTemplate);
                    _.each(sorted_list, function(item) {
                        var $thesisItem = $(getTemplate('tpl-thesis-list-item', item));
                        $('.thesis-list').append($thesisItem);
                        var id = item.Id
                        if (item.Key) {
                            id = item.Key;
                        }
                        $thesisItem.find('.edit').click(function() {
                            self.router.navigate('edit-' + id, {trigger: true});
                        });
                        $thesisItem.find('.view').click(function() {
                            self.router.navigate('thesis-' + id, {trigger: true});
                        });
                        $thesisItem.find('.delete').click(function() {
                            self.router.navigate('delete-' + id, {trigger: true});
                        });
                    });
               }
               $('.search-input').val('');
            });
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
			var self = this;
			_.each(list, function(item) {
                var $thesisItem = $(getTemplate('tpl-thesis-list-item', item));
                var id = item.Id
                if (item.Key) {
                    id = item.Key;
                }

                $thesisItem.find('.view').click(function() {
                    self.router.navigate('thesis-' + id, {trigger: true});
                });

                $thesisItem.find('.edit').click(function() {
                    self.router.navigate('edit-' + id, {trigger: true});
                });
               
                $thesisItem.find('.delete').click(function() {
                    self.router.navigate('delete-' + id, {trigger: true});
                });

                $('.thesis-list').append($thesisItem);
            });
			
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
        },
		
		deleteThesis: function(id){
            var self = this;
            $.ajax({
                type: 'DELETE',
                url: '/api/thesis/' + id,
                success: function() {
                    self.router.navigate('list', {trigger: true});
                }
            });
        },


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
            'search?=:query': 'onSearch',
            'list': 'onList',
            'delete-:id': 'onDelete'
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
            app.searchThesis(query);
			//
			app.displayLoadedList();
       },

       onList: function() {
            app.showList();
            app.loadAllThesis();
       },

       onDelete: function(id) {
            app.deleteThesis(id);
       },

    });
    app.init();


});
