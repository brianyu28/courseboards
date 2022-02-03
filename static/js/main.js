var POSITIVE = 1;
var NEUTRAL = 0;
var NEGATIVE = -1;

var socket = io.connect('//' + document.domain + ':' + location.port + '/');
var Face = function(opts) {
    this.sentiment = opts.sentiment;
    this.svg = opts.svg;
    this.cx = opts.cx;
    this.cy = opts.cy;
    this.r = opts.r;
    this.broadcast = opts.broadcast;
    this.room = opts.room;
}

Face.prototype.draw = function() {
    this.face = this.svg.append('circle')
        .attr('cx', this.cx)
        .attr('cy', this.cy)
        .attr('r', this.r);

    this.left_eye = this.svg.append('circle')
        .attr('cx', this.cx - 0.35 * this.r)
        .attr('cy', this.cy - 0.3 * this.r)
        .attr('r', 0.1 * this.r)
        .style('fill', 'black')
        .style('pointer-events', 'none');

    this.right_eye = this.svg.append('circle')
        .attr('cx', this.cx + 0.35 * this.r)
        .attr('cy', this.cy - 0.3 * this.r)
        .attr('r', 0.1 * this.r)
        .style('fill', 'black')
        .style('pointer-events', 'none');

    if (this.sentiment == POSITIVE) {
        this.face.style('fill', 'green');

        // Configure the path of the mouth.
        // Starting on the left, then to the bottom, then to the right.
        var path = 'M' + (this.cx - 0.5 * this.r) + ',' + (this.cy + 0.3 * this.r);
        path += ' Q' + (this.cx) + ',' + (this.cy + 0.8 * this.r);
        path += ' ' + (this.cx + 0.5 * this.r) + ',' + (this.cy + 0.3 * this.r);
        this.mouth = this.svg.append('path')
            .attr('d', path)
            .style('stroke-width', 0.1 * this.r)
            .style('stroke', 'black')
            .style('fill', 'none')
            .style('pointer-events', 'none');
    }
    else if (this.sentiment == NEUTRAL) {
        this.face.style('fill', 'yellow');
        this.mouth = this.svg.append('line')
            .attr('x1', this.cx - 0.5 * this.r)
            .attr('y1', this.cy + 0.4 * this.r)
            .attr('x2', this.cx + 0.5 * this.r)
            .attr('y2', this.cy + 0.4 * this.r)
            .style('stroke-width', 0.1 * this.r)
            .style('stroke', 'black')
            .style('pointer-events', 'none');
    }
    else if (this.sentiment == NEGATIVE) {
        this.face.style('fill', 'red');
        var path = 'M' + (this.cx - 0.5 * this.r) + ',' + (this.cy + 0.5 * this.r);
        path += ' Q' + (this.cx) + ',' + (this.cy);
        path += ' ' + (this.cx + 0.5 * this.r) + ',' + (this.cy + 0.5 * this.r);
        this.mouth = this.svg.append('path')
            .attr('d', path)
            .style('stroke-width', 0.1 * this.r)
            .style('stroke', 'black')
            .style('fill', 'none')
            .style('pointer-events', 'none');
    }

    this.face.on('click', function() {
        socket.emit('reaction', {
            'sentiment': this.sentiment,
            'room': this.room
        });
    }.bind(this));
}

// Have the face only last for a certain number of milliseconds
Face.prototype.duration = function(interval) {
    var _this = this;
    setTimeout(function() {
        _this.face.remove();
        _this.left_eye.remove();
        _this.right_eye.remove();
        _this.mouth.remove();
    }, interval);
}
