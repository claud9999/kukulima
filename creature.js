// CLASS: Creature
// TODO: add combat
// TODO: add time of day, season
// TODO: demeanors: hunting, afraid, wandering, horny
// TODO: move rate
function Creature(char, name, gender, demeanor, moverate, x, y, movefn, viewfn) {
    this.char = char; this.name = name; this.gender = gender; this.demeanor = demeanor;
    this.x = x; this.y = y; this.movefn = movefn; this.viewfn = viewfn;
    this.ticcount = 0; this.moverate = moverate;
    this.photographed = false;
}

creature_distribution = {
    '_' : 'cs              '
    ,'v': 'cccsssss^       '
    ,'T': 'ssCC^^^^^^      '
    ,'Y': 'ssCC^^^^^^      '
}

function Cat_move(cat) {
    cat.x++;
}

function Snake_move(snake) {
    snake.y++;
}

function Bird_move(bird) {
    bird.x += Math.floor(Math.random() * 3) - 1;
    bird.y += Math.floor(Math.random() * 3) - 1;
}

function null_view(creature) { ; }

creature_list = [];
female = 'female'; male = 'male';

function Cat(char, x, y) {
    return new Creature(char, char == 'c' ? 'small cat' : 'big cat', Math.random() > .5 ? female : male, 'hungry', 1, x, y, Cat_move, null_view);
}

function Snake(char, x, y) {
    return new Creature(char, char == 's' ? 'small snake' : 'big snake', Math.random() > .5 ? female : male, 'hungry', 5, x, y, Snake_move, null_view);
}

function Bird(char, x, y) {
    return new Creature(char, 'bird', Math.random() > .5 ? female : male, 'hungry', .5, x, y, Bird_move, null_view);
}

creature_count = 1; // consider adding this many creatures to the map each tick
max_creatures = 25; // if I get more than this, I purge the most distant ones first
min_distance_sq = 25; // at least 5 sq away (5^2)
function add_creatures() {
    for (var i = 0; i < creature_count; i++) {
	var x = loc_x + Math.floor(Math.random() * event_distance * 2) - event_distance;
	var y = loc_y + Math.floor(Math.random() * event_distance * 2) - event_distance;
	var dx = x - loc_x; var dy = y - loc_y; // might want to generalize geometry functions?
	if (dx * dx + dy * dy < min_distance_sq) continue; // don't place a new creature within the minimum distance from the player
	var t = map[x][y];
	var r = creature_distribution[t][Math.floor(Math.random() * creature_distribution[t].length)];
	switch(r) {
	    case 'c': case 'C': creature_list.push(new Cat(r, x, y)); break;
	    case 's': case 'S': creature_list.push(new Snake(r, x, y)); break;
	    case '^': creature_list.push(new Bird(r, x, y)); break;
	}
    }

    while (creature_list.length > max_creatures) {
	for (var i = 0, most_distant = 0, most_distance = 0; i < creature_list.length; i++) {
	    var dx = creature_list[i].x - loc_x; var dy = creature_list[i].y - loc_y;
	    var d = dx * dx + dy * dy;
	    if (!i || d > most_distance) { most_distant = i; most_distance = d; }
	}
	creature_list.splice(most_distant, 1);
    }
}

function move_creatures(tics) {
    for (var i = 0; i < creature_list.length; i++) {
	var c = creature_list[i];
	c.ticcount += tics;
	while (c.ticcount > c.moverate) {
	    c.movefn(c);
	    c.ticcount -= c.moverate;
	}
	if (c.x < loc_x - event_distance || c.y < loc_y - event_distance
		|| c.x > loc_x + event_distance
		|| c.y > loc_y + event_distance) creature_list.splice(i--, 1);
    }
}
