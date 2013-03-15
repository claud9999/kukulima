// CLASS: Terrain
function Terrain(char, desc, move, block_los, noise) {
    this.char = char; this.desc = desc; this.move = move;
    this.block_los = block_los; this.noise = noise;
}

terrain_options = {
    'bare_dirt' : new Terrain('_', 'bare dirt', 1, false, .1)
    ,'grass' : new Terrain('v', 'grass', 1, false, .5)
    ,'tree' : new Terrain("TY", 'tree', 0, true, 0)
};

terrain_mapping = {
    '_' : terrain_options['bare_dirt']
    ,'v' : terrain_options['grass']
    ,'Y' : terrain_options['tree']
    ,'T' : terrain_options['tree']
}

terrain_distribution = '_____vvvvYT';

function pick_terrain(x, y) {
    var c = terrain_distribution[Math.floor(Math.random() * terrain_distribution.length)];
    var nc = null;
    var i = Math.floor(Math.random() * 15);
    if (i > 11) return c;
    switch (i) {
	case 0:
	    if (x && y) nc = map[x - 1][y - 1];
	    break;
	case 1:
	case 2:
	    if (y) nc = map[x][y - 1];
	    break;
	case 3:
	    if (y && x < map.length - 1) nc = map[x + 1][y - 1];
	    break;
	case 4:
	case 5:
	    if (x) nc = map[x - 1][y];
	    break;
	case 6:
	case 7:
	    if (x < map.length - 1) nc = map[x + 1][y];
	    break;
	case 8:
	    if (x && y < map[0].length - 1) nc = map[x - 1][y + 1];
	    break;
	case 9:
	case 10:
	    if (y < map[0].length - 1) nc = map[x][y + 1];
	    break;
	case 11:
	    if (x < map.length - 1 && y < map[0].length - 1)
		nc = map[x + 1][y + 1];
	    break;
    }
    if (nc == null || nc == ' ') return c;
    else return nc;
}
