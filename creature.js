// CLASS: Creature
// TODO: add combat
// TODO: add time of day, season
// TODO: demeanors: hunting, afraid, wandering, horny
// TODO: move rate
function Creature(char, name, gender, demeanor, moverate, x, y, movefn) {
    this.char = char; this.name = name; this.gender = gender; this.demeanor = demeanor;
    this.x = x; this.y = y; this.movefn = movefn;
    this.ticcount = 0; this.moverate = moverate;
    this.photographed = false;
}

creature_distribution = {
    '_' : 'cs              '
    ,'v': 'cccsssss^       '
    ,'T': 'ssCC^^^^^^      '
    ,'Y': 'ssCC^^^^^^      '
}

function Cat_move(creature) {
    var bias_x = 0; var bias_y = 0;

    var dx = creature.x - loc_x; var dy = creature.y - loc_y;
    var sx = creature.x > loc_x ? 1 : (creature.x < loc_x ? -1 : 0);
    var sy = creature.y > loc_y ? 1 : (creature.y < loc_y ? -1 : 0);
    var noise_distance = event_distance * noise * 3;
    if (dx * dx + dy * dy <= 2) {
	creature.x += sx;
	creature.x += sy;
	if (Math.random() > .7) {
	    damage(Math.random() * (creature.char == 'C' ? 50 : 10), 'The cat slashes you with its claws!');
	} else msg('The cat slashes at you and misses.', 200);
	return;
    } else if (dx * dx + dy * dy < noise_distance) {
	if (creature.char == 'C' && Math.random() > .5) creature.demeanor = 'hungry'; // HUNT!
	else creature.demeanor = 'flee';
	bias_x = sx; bias_y = sy;
    }
    if (dx * dx + dy * dy > noise_distance * 1.5) creature.demeanor = 'rest';

    for (var i = 0; i < creature_list.length; i++) {
	var c = creature_list[i];
	var sx = creature.x > c.x ? -1 : (creature.x < c.x ? 1 : 0);
	var sy = creature.y > c.y ? -1 : (creature.y < c.y ? 1 : 0);
	if (c == creature) continue;
	var dx = creature.x - c.x; var dy = creature.y - c.y;
	var dist_sq = dx * dx + dy * dy;
	switch(creature_list[i].char) {
	    case '^':
		if (dist_sq < 100) { demeanor = 'hungry'; bias_x += sx; bias_y += sy; }
		break;
	    case 'c':
		if (dist_sq < 60) { demeanor = 'flock'; bias_x -= sx * .6; bias_y -= sy * .6; }
		break;
	    case 's':
		if (dist_sq < 70) { demeanor = 'hungry'; bias_x += sx * .4; bias_y += sy * .4; }
		break;
	}
    }

    switch(creature.demeanor) {
	case 'hungry':
	    // when hungry, will tend to settle in trees
	    if (terrain_mapping[map[creature.x][creature.y]] != terrain_options['tree'] || Math.random() < .4) {
		creature.x += Math.floor(Math.random() * 3 - 1);
		creature.y += Math.floor(Math.random() * 3 - 1);
	    }
	    break;
	case 'flee':
	case 'flock':
	    creature.x += Math.floor(Math.random() * 3 - 1 + bias_x);
	    creature.y += Math.floor(Math.random() * 3 - 1 + bias_y);
	    break;
	case 'rest': // do nothing!
	    break;
    }
}

function Snake_move(creature) {
    var bias_x = 0; var bias_y = 0;

    var dx = creature.x - loc_x; var dy = creature.y - loc_y;
    var sx = creature.x > loc_x ? 1 : (creature.x < loc_x ? -1 : 0);
    var sy = creature.y > loc_y ? 1 : (creature.y < loc_y ? -1 : 0);
    var noise_distance = event_distance * noise;
    if (dx * dx + dy * dy <= 2) {
	creature.x += sx;
	creature.x += sy;
	if (Math.random() > .7) {
	    damage(Math.random() * 3, 'The snake strikes...And the fangs sink in.');
	    poison = Math.floor(Math.random() * 4 + 6);
	} else msg('The snake strikes...And misses.', 200);
	return;
    } else if (dx * dx + dy * dy < noise_distance) {
	creature.demeanor = 'flee';
	bias_x = sx; bias_y = sy;
    }
    if (dx * dx + dy * dy > noise_distance * 1.5) creature.demeanor = 'hungry';

    for (var i = 0; i < creature_list.length; i++) {
	var c = creature_list[i];
	var sx = creature.x > c.x ? -1 : (creature.x < c.x ? 1 : 0);
	var sy = creature.y > c.y ? -1 : (creature.y < c.y ? 1 : 0);
	if (c == creature) continue;
	var dx = creature.x - c.x; var dy = creature.y - c.y;
	var dist_sq = dx * dx + dy * dy;
	switch(creature_list[i].char) {
	    case '^':
		if (dist_sq < 4) { demeanor = 'hungry'; bias_x += sx; bias_y += sy; }
		break;
	    case 'c':
		if (dist_sq < 8) { demeanor = 'flee'; bias_x -= sx * .6; bias_y -= sy * .6; }
		break;
	    case 's':
		if (dist_sq < 3) { demeanor = 'flock'; bias_x += sx * .3; bias_y += sy * .3; }
		break;
	}
    }

    switch(creature.demeanor) {
	case 'hungry':
	    // when hungry, will tend to settle in trees
	    if (terrain_mapping[map[creature.x][creature.y]] != terrain_options['tree'] || Math.random() < .4) {
		creature.x += Math.floor(Math.random() * 3 - 1);
		creature.y += Math.floor(Math.random() * 3 - 1);
	    }
	    break;
	case 'flee':
	case 'flock':
	    creature.x += Math.floor(Math.random() * 3 - 1 + bias_x);
	    creature.y += Math.floor(Math.random() * 3 - 1 + bias_y);
	    break;
    }
}

function Bird_move(creature) {
    var bias_x = 0; var bias_y = 0;

    var dx = creature.x - loc_x; var dy = creature.y - loc_y;
    var sx = creature.x > loc_x ? 1 : (creature.x < loc_x ? -1 : 0);
    var sy = creature.y > loc_y ? 1 : (creature.y < loc_y ? -1 : 0);
    var noise_distance = event_distance * noise * 2;
    if (dx * dx + dy * dy < noise_distance) {
	creature.demeanor = 'flee';
	bias_x = sx; bias_y = sy;
    }
    if (dx * dx + dy * dy > noise_distance * 1.5) creature.demeanor = 'hungry';

    for (var i = 0; i < creature_list.length; i++) {
	var c = creature_list[i];
	var sx = creature.x > c.x ? -1 : (creature.x < c.x ? 1 : 0);
	var sy = creature.y > c.y ? -1 : (creature.y < c.y ? 1 : 0);
	if (c == creature) continue;
	var dx = creature.x - c.x; var dy = creature.y - c.y;
	var dist_sq = dx * dx + dy * dy;
	switch(creature_list[i].char) {
	    case '^':
		if (dist_sq < 6) { demeanor = 'flock'; bias_x += sx * .2; bias_y += sy * .2; }
		break;
	    case 'c':
		if (dist_sq < 8) { demeanor = 'flee'; bias_x -= sx * .6; bias_y -= sy * .6; }
		break;
	    case 's':
		if (dist_sq < 3) { demeanor = 'flee'; bias_x -= sx * .8; bias_y -= sy * .8; }
		break;
	}
    }

    switch(creature.demeanor) {
	case 'hungry':
	    // when hungry, will tend to settle on favorite food
	    // (currently only grass)
	    if (map[creature.x][creature.y] != 'v' || Math.random() < .2) {
		creature.x += Math.floor(Math.random() * 3 - 1);
		creature.y += Math.floor(Math.random() * 3 - 1);
	    }
	    break;
	case 'flee':
	case 'flock':
	    creature.x += Math.floor(Math.random() * 3 - 1 + bias_x);
	    creature.y += Math.floor(Math.random() * 3 - 1 + bias_y);
	    break;
    }
}

creature_list = [];
female = 'female'; male = 'male';

function Cat(char, x, y) {
    return new Creature(char, char == 'c' ? 'small cat' : 'big cat', Math.random() > .5 ? female : male, 'hungry', 1, x, y, Cat_move);
}

function Snake(char, x, y) {
    return new Creature(char, char == 's' ? 'small snake' : 'big snake', Math.random() > .5 ? female : male, 'hungry', 5, x, y, Snake_move);
}

function Bird(char, x, y) {
    return new Creature(char, 'bird', Math.random() > .5 ? female : male, 'hungry', .5, x, y, Bird_move);
}

creature_count = 1; // consider adding this many creatures to the map each tick
max_creatures = 25; // if I get more than this, I purge the most distant ones first
min_distance_sq = 25; // at least 5 sq away (5^2)
function add_creatures() {
    for (var i = 0; i < creature_count; i++) {
	var x = loc_x + Math.floor(Math.random() * event_distance * 2 - event_distance);
	var y = loc_y + Math.floor(Math.random() * event_distance * 2 - event_distance);
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
