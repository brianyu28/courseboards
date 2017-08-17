var board;
$(document).ready(function() {
    var room = $('#teacher-board').data('room');
    board = new TeacherBoard({
        'identifier': '#teacher-board',
        'width': window.innerWidth,
        'height': window.innerHeight
    });
    board.draw();
    socket.on('show_reaction', function(data) {
        // If the reaction isn't for this room, ignore it.
        if (data['room'].toLowerCase() != room.toLowerCase())
            return;
        board.show_reaction(data['sentiment']);
    });
});

$(window).resize(function() {
    board.redraw(window.innerWidth, window.innerHeight);
});

var TeacherBoard = function(opts) {
    this.identifier = opts.identifier;
    this.width = opts.width;
    this.height = opts.height;
}

TeacherBoard.prototype.draw = function() {
    var _this = this;
    this.canvas = d3.select(this.identifier);
    this.canvas.selectAll('*').remove();
    var canvas = this.canvas;

    this.svg = canvas.append('svg')
                     .attr('width', this.width)
                     .attr('height', this.height)
                     .classed('svg', true);
    var svg = this.svg;
}

TeacherBoard.prototype.redraw = function(width, height) {
    this.width = width;
    this.height = height;
}

TeacherBoard.prototype.show_reaction = function(sentiment) {
    var radius = 30;
    var diameter = 2 * radius;
    var face = new Face({
        'sentiment': sentiment,
        'svg': this.svg,
        'cx': diameter + (Math.random() * (this.width - 2 * diameter)),
        'cy': diameter + (Math.random() * (this.height - 2 * diameter)),
        'r': radius,
        'room': $('#teacher-board').data('room'),
        'broadcast': false
    });
    face.draw();
    face.duration(3000);
}
