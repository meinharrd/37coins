define(['backbone',
    'communicator',
    'models/loginModel',
    'models/accountRequest',
    'models/resetRequest',
    'models/resetConf',
    'models/signupConf',
    'models/balanceModel',
    'collections/gatewayCollection',
    'views/indexView',
    'views/loginView',
    'views/gatewayView',
    'views/faqView',
    'views/contactView',
    'views/verifyView',
    'views/validateView',
    'views/captchaView',
    'views/logoutView',
    'views/signupView',
    'views/resetView',
    'views/resetConfView',
    'views/signupConfView',
    'views/balanceView',
    'routeFilter'
    ], function(Backbone, Communicator, LoginModel, AccountRequest, ResetRequest, ResetConf, SignupConf, BalanceModel, GatewayCollection, IndexView, LoginView, GatewayView, FaqView, ContactView, VerifyView, ValidateView, CaptchaView, LogoutView, SignupView, ResetView, ResetConfView, SignupConfView, BalanceView) {
    'use strict';

    var Controller = {};

    // private module/app router  capture route and call start method of our controller
    Controller.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
            '': 'showIndex',
            'gateways': 'showGateway',
            'balance': 'showBalance',
            'faq': 'showFaq',
            'confSignup/:token': 'confirmSignUp',
            'confReset/:token': 'confirmReset',
            'reset': 'showReset',
            'contact': 'showContact',
            'signUp': 'showSignUp',
            'logout': 'showLogout'
        },
        before:{
            'signUp': 'getTicket',
            'reset': 'getTicket',
            'gateways': 'showLogin',
            'balance': 'showLogin',
            '*any': function(fragment, args, next){
                next();
            }
        },
        getTicket: function(fragment, args, next) {
            if (!this.options.controller.ticket){
                //TODO: show wain screen
                var self = this;
                $.post( window.opt.basePath + '/ticket', function( data ) {
                    self.options.controller.ticket = data.value;
                    next();
                },'json').fail(function() {
                    var view = new CaptchaView({next:next,controller:self.options.controller});
                    Communicator.mediator.trigger('app:show', view);
                });
            }else{
                next();
            }
        },
        showLogin: function(fragment, args, next) {
            if (!this.options.controller.loginStatus){
                this.options.controller.loginStatus = new LoginModel();
            }
            var view;
            var model = this.options.controller.loginStatus;
            if (model.get('roles')){
                next();
            }else{
                view = new LoginView({model:model,next:next});
                Communicator.mediator.trigger('app:show', view);
            }
        }
    });

    Communicator.mediator.on('app:verify', function() {
        var view;
        if (Controller.loginStatus.get('mobile') && Controller.loginStatus.get('fee')){
            view = new GatewayView({model:Controller.loginStatus});
            Communicator.mediator.trigger('app:show', view);
        }else if (Controller.loginStatus.get('mobile')){
            view = new ValidateView({model:Controller.loginStatus});
            Communicator.mediator.trigger('app:show', view);
        }else {
            view = new VerifyView({model:Controller.loginStatus});
            Communicator.mediator.trigger('app:show', view);
        }
    });

    Controller.showIndex = function() {
        var gateways = new GatewayCollection();
        //model:new Backbone.Model({resPath:window.opt.resPath})
        var view = new IndexView({collection:gateways});
        Communicator.mediator.trigger('app:show', view);
        gateways.fetch();
    };

    Controller.showGateway = function() {
        Communicator.mediator.trigger('app:verify');
    };

    Controller.showFaq = function() {
        var view = new FaqView();
        Communicator.mediator.trigger('app:show', view);
    };

    Controller.showContact = function() {
        var view = new ContactView();
        Communicator.mediator.trigger('app:show', view);
    };

    Controller.showBalance = function() {
        var balance = new BalanceModel();
        var view = new BalanceView({model:balance});
        Communicator.mediator.trigger('app:show', view);
        balance.fetch();
    };

    Controller.showLogin = function(fragment, args, next) {
        if (!this.loginStatus){
            this.loginStatus = new LoginModel();
        }
        var view = new LoginView({model:this.loginStatus,next:next});
        Communicator.mediator.trigger('app:show', view);
    };
    Controller.showLogout = function() {
        var contentView = new LogoutView();
        Communicator.mediator.trigger('app:show',contentView);
    };
    Controller.showSignUp = function() {
        var accountRequest = new AccountRequest({ticket:Controller.ticket});
        var contentView = new SignupView({model:accountRequest});
        Communicator.mediator.trigger('app:show',contentView);
    };
    Controller.confirmSignUp = function(token) {
        var model = new SignupConf({token:token});
        var contentView = new SignupConfView({model: model});
        Communicator.mediator.trigger('app:show',contentView);
        model.save();
    };
    Controller.showReset = function() {
        var model = new ResetRequest({ticket:Controller.ticket});
        var contentView = new ResetView({model:model});
        Communicator.mediator.trigger('app:show',contentView);
    };
    Controller.confirmReset = function(token) {
        var model = new ResetConf({token:token});
        var contentView = new ResetConfView({model: model});
        Communicator.mediator.trigger('app:show',contentView);
    };

    return Controller;
});