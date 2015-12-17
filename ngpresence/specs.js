// a test suite (group of tests)
describe('ngpresence directive', function() {

  var templateImport = document.getElementById('ng-presence-html-import').import
    , template = templateImport.querySelector('.presence').outerHTML;

  var scope, elem, presence, channel;

  var mockUser1 = {
    name: "Chet Faker",
    username: "chetthefaker"
  };

  var mockUser2 = {
    name: "Faker Baker",
    username: "baker"
  };


  beforeEach(function() {
    module('app');
    inject(function($compile, $rootScope, _presence_, $templateCache){

      presence = _presence_;
      spyOn(presence, "subscribe").and.callThrough(); // replace this with mock implementation when Pusher is implented
      spyOn(presence, "unsubscribe").and.callThrough(); // replace this with mock implementation when Pusher is implented

      $templateCache.put('ng-presence.html', template);

      scope = $rootScope.$new();
      scope.channelName = 'test-channel';

      var html = "<div ng-presence presence-channel-name='{{ channelName }}'></div>";
      elem = $compile(angular.element(html))(scope);

      scope.$digest();

      channel = presence.channels[scope.channelName];
    });
  });


  it('should have subscribed user', function () {
    expect(channel).toBeDefined();
    expect(presence.subscribe).toHaveBeenCalled();
    expect(channel.members.length).toBe(1);
  });


  it('should have a label', function () {
    expect(elem.find('.presence-label').text()).toEqual('Also here:');
  });


  it('should have 2 users', function () {
    channel.members.push(mockUser1);
    channel.members.push(mockUser2);
    channel.trigger('member_added');

    expect(elem.find('.user').length).toBe(2);
  });


  it('should have 1 user', function () {
    channel.members.push(mockUser1);
    channel.members.push(mockUser2);
    channel.members.pop();
    channel.trigger('member_removed');

    expect(elem.find('.user').length).toBe(1);
  });

  it('should have unsubscribed user', function () {
    scope.$broadcast('$destroy');
    expect(presence.subscribe).toHaveBeenCalled();
    //...
  });



});