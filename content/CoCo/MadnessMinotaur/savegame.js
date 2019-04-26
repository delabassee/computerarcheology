var ROOM_DESC = [
'STONE TOWER', 'EMPTY ROOM', 'GUARD ROOM', 'PILE OF BONES', 'CLEAN ROOM', 'TROPHY ROOM', 'EMPTY CLOSET', 'SLOPING SHAFT',
// 8
'MARBLE FLOOR', 'NARCISSUS PLANTS', 'TABLE AND CHAIR', 'PAINTING', 'BROKEN GLASS', 'BROKEN TILES', 'BED ROOM', 'NO WINDOWS',
// 16
'WEST, POOL', 'EAST, POOL', 'SMALL LIBRARY', 'ANCIENT CARVINGS', 'GREEN MARBLE', 'WINE CELLAR', 'THE KING', 'MIST SWIRLING',
// 24
'WIDE HALL', 'MARBLE PORTAL', 'ROYAL COURT', 'VOICES, DEAD', 'DARK CHAMBER', 'GREEN MIST', 'BROKEN SHADOW', 'CEILING, SLOPING',
// 32
'TWISTING STAIR', 'DARK, TOWER', 'SUNKEN PIT', 'SERVANT CHAMBER', 'PANTRY', 'GREAT BEER', 'EMPTY CHAMBER', 'TEMPLE OF ZEUS',
// 40
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE, PIT', 'MAZE', 'MAZE', 'MAZE',
// 48
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 56
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',

// 64
'GREAT PIT', 'STONE WALL', 'SMALL ROOM', 'GREAT CRYPT', 'BONES, WALL', 'CHILL MIST', 'FOUL SMELLING', 'STONE SHAFT',
// 72
'HALL, COURT', 'EMPTY CHAMBER', 'LARGE POOL','LARGE CAVERN', 'TWISTING PASSAGE', 'SHALLOW HOLE', 'CHASM,SOUTH', 'STONE, CARVINGS',
// 80
'TWISTING MUSTY', 'SUNKEN ROOM', 'CHILL DAMP', 'CAVERN, STONE', 'WINDING PASSAGE', 'TWISTING WINDING', 'SMALL CHAMBER', 'SHALLOW PIT',
// 88
'MUSTY, CORRIDOR', 'EDGE, SHAFT', 'TOMB, SKULL', 'STONE TILES', 'WIDE ROOM', 'WOOD PASSAGE', 'WIDE HALL', 'STONE TUNNEL',
// 96
'MUSTY PASSAGE', 'TWISTING PASSAGE', 'BROKEN PASSAGE', 'BROKEN STONE', 'STONE CHAPEL', 'LONG PASSAGE', 'ANCIENT KING', 'CAVE, VOICES',
// 104
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 112
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 120
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',

// 128
'NARROW TUNNEL', 'SMOOTH MARBLE', 'HALL, CORNER', 'STONE CORRIDOR', 'PATH, TRACKS', 'DEEP PIT', 'DEAD END', 'MINOTAUR TRACKS',
// 136
'SMALL CAVERN', 'GREAT STONE', 'DARK CHAMBER', 'NARROW TUNNEL', 'NARROW TWISTING', 'NARROW TWISTING', 'MUSTY, BONES','NORTH, PIT',
// 144
'HIGH NARROW', 'FOUL SMELLING', 'NARROW TUNNEL', 'NARROW, CORRIDOR', 'TWISTING, WINDING', 'NARROW WINDING', 'LAIR, DEAD', 'SOUTH,PIT',
// 152
'GREAT TUNNEL', 'LARGE CAVERN', 'GREAT STONE', 'TWISTING CORRIDOR', 'CAVERN, BONES', 'WINDING TWISTING', 'LAIR, MINOTAUR', 'SLOPING TRAIL',
// 160
'BROKEN BONES', 'LARGE STONE', 'STONE CROSS', 'LARGE WIDE','NARROW PATH', 'BURIED TEMPLE', 'SHALLOW, CAVER', 'GREAT CAVERN',
// 168
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 176
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 184
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',

// 192
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 200
'MAZE', 'MAZE', 'GREAT FOREST', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 
// 208
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 216
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 224
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 232
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 240
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
// 248
'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE', 'MAZE',
]

var FRAGS = {
		'roomStart' : '<g transform="translate({{x}},{{y}})">'+
		                '<rect x="0" y="0" width="150" height="150" fill="{{color}}" stroke="black"/>'+
		                '<text x="5" y="15" font-size="10">{{room_num}}: {{room_desc}}</text>',
		'roomEnd' : '</g>',
		
		'floorSep'  : '<line x1="100" y1="{{y1}}" x2="1825" y2="{{y2}}" stroke="gray"/>'
}

function sub(s,dict) {
	for(key in dict) {
		s = s.replace('{{'+key+'}}',dict[key]);
	}
	return s;
}


function viewSaveFile(data) {
	data = atob(data);
	
	// Fix scrolling for the map
	$('.content div').css('overflow','unset');
	
	var g = '<g transform="scale(0.70)">';
	var rn;
	var fn;
	var x,y,color;
	for(rn=0;rn<256;++rn) {
		fn = ~~(rn / 64);
		x = (rn%64)%8;
		y = ~~((rn%64)/8);
		
		color = '#EEE';
		if(ROOM_DESC[rn] == 'MAZE') {
			color = '#CCC';
		}
	
		subs = {
				x:(150+75)*x+100,
				y:(150+75)*y+100+2000*fn,
				color:color,
				room_num:rn,
				room_desc:ROOM_DESC[rn]
		}
		
		
		g = g + sub(FRAGS.roomStart,subs);
		g = g + FRAGS.roomEnd;
	
	}
	
	for(y=1;y<4;++y) {
		g = g + sub(FRAGS.floorSep,{y1:y*2000-35,y2:y*2000-35});
	}
	
	g = g + '</g>';
	
	
	$('#svg').html(g);		
	
}

