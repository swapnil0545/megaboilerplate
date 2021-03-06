describe('ContactCtrl', function() {
  var httpBackend, controller, scope;

  beforeEach(module('MyApp'));

  beforeEach(inject(function($httpBackend, $controller) {
    scope = {};
    httpBackend = $httpBackend;
    controller = $controller('ContactCtrl', { $scope: scope });

    httpBackend.whenGET(/.html/).respond(200);
    httpBackend.whenGET(/.js/).respond(200);
    httpBackend.whenGET(/.css/).respond(200);
  }));

  it('should exist', function() {
    expect(controller).toBeDefined();
  });

  it('should have a function sendContactForm', function() {
    expect(scope.sendContactForm).toBeDefined();
  });

  it('should send contact form with success', function() {
    httpBackend.whenPOST('/contact').respond({ msg: 'Thank you! Your feedback has been submitted.' });
    scope.contact = {
      name: 'Eugene J. Gentry',
      email: 'EugeneJGentry@email.com',
      message: 'Lorem ipsum'
    };
    scope.sendContactForm(scope.contact);
    httpBackend.flush();
    expect(scope.messages).toBeDefined();
    expect(scope.messages.success).toContain({ msg: 'Thank you! Your feedback has been submitted.' });
  });

  it('should send contact form and handle errors', function() {
    httpBackend.whenPOST('/contact').respond(400, [
      { param: 'name', msg: 'Name cannot be blank' },
      { param: 'email', 'msg': 'Email is not valid' },
      { param: 'email', msg: 'Email cannot be blank' },
      { param: 'message', msg: 'Message cannot be blank' }
    ]);
    scope.sendContactForm();
    httpBackend.flush();
    expect(scope.messages).toBeDefined();
    expect(scope.messages.error.length).toEqual(4);
    expect(scope.messages.error).toContain({ param: 'name', msg: 'Name cannot be blank' });
  });
});
