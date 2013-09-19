var DefProgress = Backbone.Model.extend({
  defaults: {
    progress: 0,
    type: 'resolved',
    status: 'pending'
  },

  tick: function() {
    var self = this;
    if (this.get('progress') <= 100) {
      this.set('progress', this.get('progress')+ Math.random()*10);

      setTimeout(function() {
        self.tick()
      }, 50);
    } else {
      setTimeout(function(){
        self.set('status', self.get('type'))
        self.trigger('progress:' + self.get('type'))
      }, 700);
    }
  }
});

var DefView = Backbone.View.extend({

  className: 'deferred',

  events: {
    'click span.glyphicon-play': 'playProgress'
  },

  initialize: function(attrs) {
    this.model = new DefProgress(attrs);
    $('body').append( this.render() );
    this.model.on('change:progress', _.bind(this.updateProgress, this));
    this.model.on('progress:resolved progress:rejected', _.bind(this.always, this));
    this.model.on('change:status', _.bind(this.statusChange, this));
    this.model.on('progress:resolved', _.bind(this.resolved, this));
    this.model.on('progress:rejected', _.bind(this.rejected, this));
  },

  render: function() {
    this.$el.html('<span class="glyphicon glyphicon-play"></span>')
    this.$el.append('<div class="progress active progress-striped"><div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:0%;"> </div> </div>')
    this.$el.append('<span class="status">'+this.model.get('status')+'</span>')
    return this.$el;
  },

  updateProgress: function() {
    this.$('.progress-bar').css({width: this.model.get('progress')+'%'})
  },

  playProgress: function() {
    this.model.tick();
  },

  statusChange: function() {
    this.$('.status').html(this.model.get('status'))
  },

  always: function() {
    console.log('always')
  },

  resolved: function() {
    this.$('.active')
      .removeClass('active')
      .find('.progress-bar')
      .addClass('progress-bar-success')
  },

  rejected: function() {
    this.$('.active')
      .removeClass('active')
      .find('.progress-bar')
      .addClass('progress-bar-danger')
  }

});