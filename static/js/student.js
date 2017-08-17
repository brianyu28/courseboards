var board;
$(document).ready(function() {
    board = new StudentBoard({
        'identifier': '#student-board',
        'width': window.innerWidth,
        'height': window.innerHeight
    });
    board.draw();
});

$(window).resize(function() {
    board.redraw(window.innerWidth, window.innerHeight);
});

var StudentBoard = function(opts) {
    this.identifier = opts.identifier;
    this.width = opts.width;
    this.height = opts.height;
}

StudentBoard.prototype.draw = function() {
    var _this = this;
    this.canvas = d3.select(this.identifier);
    this.canvas.selectAll('*').remove();
    var canvas = this.canvas;

    this.svg = canvas.append('svg')
                     .attr('width', this.width)
                     .attr('height', this.height)
                     .classed('svg', true);
    var svg = this.svg;

    this.calculate_bounds();
    this.redraw(this.width, this.height);

}

StudentBoard.prototype.redraw = function(width, height) {
    this.width = width;
    this.height = height;
    this.svg.attr('width', width).attr('height', height);
    this.svg.selectAll('*').remove();
    this.calculate_bounds();

    var sentiments = [NEGATIVE, NEUTRAL, POSITIVE];
    for (var i = 0; i < this.centers.length; i++) {
        var face = new Face({
            'sentiment': sentiments[i],
            'svg': this.svg,
            'cx': this.centers[i][0],
            'cy': this.centers[i][1],
            'r': this.radius,
            'room': $('#student-board').data('room'),
            'broadcast': true
        });
        face.draw();
    }
}

// Computes the centers of the faces and their size.
StudentBoard.prototype.calculate_bounds = function() {
    
    // Optimally, have at least 10 pixels of pading on each side
    // of a 300 pixel image.
    if (this.width >= 960) {
        var sector = this.width / 3;
        var cx = sector / 2;
        var cy = this.height / 2;

        this.centers = [[cx, cy], [cx + sector, cy], [cx + 2 * sector, cy]];
        this.radius = 150;
    }

    // Otherwise, for sufficiently large screens,
    // just scale down based on an expectation of 10
    // pixels of padding.
    else if (this.width >= 600) {
        var sector = this.width / 3;
        var cx = sector / 2;
        var cy = this.height / 2;

        this.centers = [[cx, cy], [cx + sector, cy], [cx + 2 * sector, cy]];
        this.radius = cx - 10;
    }

    else {
        var sector = this.height / 3;
        var cx = this.width / 2;
        var cy = sector / 2;

        this.centers = [[cx, cy], [cx, cy + sector], [cx, cy + 2 * sector]];
        this.radius = cy - 10;
    }
}
