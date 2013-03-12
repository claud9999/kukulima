// CLASS: Creature
// TODO: add combat
// TODO: add time of day, season
function Creature(char, name, desc, x, y, movefn, viewfn) {
    this.char = char; this.name = name; this.desc = desc; this.x = x; this.y = y; this.movefn = movefn; this.viewfn = viewfn;
}

creature_distribution = {
    '_' : 'cs              '
    ,'v': 'cccsssss^       '
    ,'T': 'ssCC^^^^^^      '
    ,'Y': 'ssCC^^^^^^      '
}

function cat_move(cat) {
    cat.x++;
}

function snake_move(snake) {
    snake.y++;
}

function bird_move(bird) {
    bird.x += Math.floor(Math.random() * 5) - 2;
    bird.y += Math.floor(Math.random() * 5) - 2;
}

function null_view(creature) { ; }

creature_list = [];

creature_count = 1; // consider adding this many creatures to the map each tick
max_creatures = 25; // if I get more than this, I purge the most distant ones first
min_distance_sq = 25; // at least 5 sq away (5^2)
function add_creatures() {
    for (i = 0; i < creature_count; i++) {
	x = Math.floor(Math.random() * (buffer_width - 2)) + 1;
	y = Math.floor(Math.random() * (buffer_height - 2)) + 1;
	dx = x - loc_x; dy = y - loc_y; // might want to generalize geometry functions?
	if (dx * dx + dy * dy < min_distance_sq) continue; // don't place a new creature within the minimum distance from the player
	t = map_text[y * buffer_width + x];
	r = creature_distribution[t][Math.floor(Math.random() * creature_distribution[t].length)];
	switch(r) {
	    case 'c': creature_list.push(new Creature('c', 'small cat', 'a small cat', x, y, cat_move, null_view)); break;
	    case 's': creature_list.push(new Creature('s', 'small snake', 'a small snake', x, y, snake_move, null_view)); break;
	    case 'C': creature_list.push(new Creature('C', 'big cat', 'a big cat', x, y, cat_move, null_view)); break;
	    case '^': creature_list.push(new Creature('^', 'small bird', 'a small bird', x, y, bird_move, null_view)); break;
	}
    }

    while (creature_list.length > max_creatures) {
	for (i = 0, most_distant = 0, most_distance = 0; i < creature_list.length; i++) {
	    dx = creature_list[i].x - loc_x; dy = creature_list[i].y - loc_y;
	    d = dx * dx + dy * dy;
	    if (!i || d > most_distance) { most_distant = i; most_distance = d; }
	}
	creature_list.splice(most_distant, 1);
    }
}

function move_creatures() {
    for (i = 0; i < creature_list.length; i++) {
	creature_list[i].movefn(creature_list[i]);
    }
}
