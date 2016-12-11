define(['angularMock', 'app', 'spechelper'], function(angular) {

    describe('clhNewsControllers', function() {
        var $location;
        var $controller;

        var news = {
            "slug": "hello-world",
            "creator": {
                "name": "Admin"
            },
            "subject": "Hello World!",
            "text": "**This** is a **first** test news! `Welcome!`",
            "createDate": "2016-06-18T15:59:25.390Z"
        };

        beforeEach(function () {
            module('clhApp');

            inject(function(_$location_, _$controller_) {
                $controller = _$controller_;
                $location = _$location_;
            });
        });

        describe('NewsCtrl', function() {
            var newsUpdated = {
                "slug": "hello-world-1",
                "creator": {
                    "name": "Admin1"
                },
                "subject": "Hello World!1",
                "text": "**This** is a **first** test news! `Welcome!1`",
                "createDate": "2016-06-18T15:59:26.390Z"
            };

            var vm;

            beforeEach(function() {
                vm = $controller('NewsCtrl', { data: [ news ] });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.$location).toBeDefined();
                expect(vm.isAdmin).toBeFalsy();
                expect(vm.ResourceService).toBeDefined();
                expect(vm.toastr).toBeDefined();
                expect(vm.currentNews).toBe(news);
                expect(vm.currentNews.html.toString())
                    .toBe('<p><strong>This</strong> is a <strong>first</strong> test news! <code>Welcome!</code></p>');
            });

            it('currentNews start modify', function() {
                vm.editCurrentNews();
                expect(vm.currentNews.modify).toBe(true);
                expect(vm.currentNews.oldSlug).toBe(vm.currentNews.slug);
            });

            it('currentNews finish modify', function() {
                spyOn(vm.ResourceService, 'updateNews').and.callFake(mockPromise(newsUpdated));
                spyOn(vm.toastr, 'success');
                vm.editCurrentNews();
                vm.updateCurrentNews();
                expect(vm.ResourceService.updateNews).toHaveBeenCalled();
                expect(vm.currentNews.modify).toBe(false);
                expect(vm.currentNews).toBe(newsUpdated);
                expect(vm.currentNews.html.toString())
                    .toBe('<p><strong>This</strong> is a <strong>first</strong> test news! <code>Welcome!1</code></p>');
                expect(vm.currentNews.oldSlug).toBe(undefined);
                expect(vm.toastr.success).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('currentNews modify permissions missing', function() {
                spyOn(vm.ResourceService, 'updateNews').and.callFake(mockPromise({status: 401}, true));
                spyOn(vm.toastr, 'error');
                vm.editCurrentNews();
                vm.updateCurrentNews();
                expect(vm.ResourceService.updateNews).toHaveBeenCalled();
                expect(vm.currentNews.modify).toBe(true);
                expect(vm.currentNews).toBe(news);
                expect(vm.currentNews.html.toString())
                    .toBe('<p><strong>This</strong> is a <strong>first</strong> test news! <code>Welcome!</code></p>');
                expect(vm.currentNews.oldSlug).toBe(vm.currentNews.slug);
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('currentNews modify server error', function() {
                spyOn(vm.ResourceService, 'updateNews').and.callFake(mockPromise({data:{message:'123'}}, true));
                spyOn(vm.toastr, 'error');
                vm.editCurrentNews();
                vm.updateCurrentNews();
                expect(vm.ResourceService.updateNews).toHaveBeenCalled();
                expect(vm.currentNews.modify).toBe(true);
                expect(vm.currentNews).toBe(news);
                expect(vm.currentNews.html.toString())
                    .toBe('<p><strong>This</strong> is a <strong>first</strong> test news! <code>Welcome!</code></p>');
                expect(vm.currentNews.oldSlug).toBe(vm.currentNews.slug);
                expect(vm.toastr.error).toHaveBeenCalledWith('123');
            });

            it('currentNews delete', function() {
                spyOn(vm.ResourceService, 'deleteNews').and.callFake(mockPromise({}));
                spyOn(vm.toastr, 'success');
                vm.deleteCurrentNews();
                expect(vm.ResourceService.deleteNews).toHaveBeenCalled();
                expect($location.path()).toBe('/index');
                expect(vm.toastr.success).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('currentNews delete permissions missing', function() {
                spyOn(vm.ResourceService, 'deleteNews').and.callFake(mockPromise({status: 401}, true));
                spyOn(vm.toastr, 'error');
                vm.deleteCurrentNews();
                expect(vm.ResourceService.deleteNews).toHaveBeenCalled();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('currentNews delete server error', function() {
                spyOn(vm.ResourceService, 'deleteNews').and.callFake(mockPromise({data: {message: '123'}}, true));
                spyOn(vm.toastr, 'error');
                vm.deleteCurrentNews();
                expect(vm.ResourceService.deleteNews).toHaveBeenCalled();
                expect(vm.toastr.error).toHaveBeenCalledWith('123');
            });

        });

        describe('NewsCreateCtrl', function() {
            var vm;

            beforeEach(function() {
                vm = $controller('NewsCreateCtrl', { data: [ news ] });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.$location).toBeDefined();
                expect(vm.ResourceService).toBeDefined();
                expect(vm.toastr).toBeDefined();
                expect(vm.newNews).toBeDefined();
            });

            it('createNews', function() {
                vm.newNews.subject = news.subject;
                spyOn(vm.ResourceService, 'createNews').and.callFake(mockPromise(news));
                spyOn(vm.toastr, 'success');
                vm.createNews();
                expect(vm.newNews.slug).toBe('hello-world');
                expect(vm.ResourceService.createNews).toHaveBeenCalled();
                expect($location.path()).toBe('/news/hello-world');
                expect(vm.toastr.success).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('createNews permissions missing', function() {
                vm.newNews.subject = news.subject;
                spyOn(vm.ResourceService, 'createNews').and.callFake(mockPromise({status: 401}, true));
                spyOn(vm.toastr, 'error');
                vm.createNews();
                expect(vm.ResourceService.createNews).toHaveBeenCalled();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('createNews server error', function() {
                vm.newNews.subject = news.subject;
                spyOn(vm.ResourceService, 'createNews').and.callFake(mockPromise({data: {message: '123'}}, true));
                spyOn(vm.toastr, 'error');
                vm.createNews();
                expect(vm.ResourceService.createNews).toHaveBeenCalled();
                expect(vm.toastr.error).toHaveBeenCalledWith('123');
            });

        });
    });

});