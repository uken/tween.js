module( 'Tweens' );

test( "constructor", function() {

	var	t = new TWEEN.Tween( {} );

	ok( t instanceof TWEEN.Tween, "Pass" );

});

test( "Return the same tween instance for method chaining", function() {

	var t = new TWEEN.Tween( {} );

	ok( t.to({}, 0) instanceof TWEEN.Tween );
	equal( t.to({}, 0), t );

	ok( t.start() instanceof TWEEN.Tween );
	equal( t.start(), t );

	ok( t.stop() instanceof TWEEN.Tween );
	equal( t.stop(), t );

	ok( t.delay() instanceof TWEEN.Tween );
	equal( t.delay(), t );

	ok( t.easing() instanceof TWEEN.Tween );
	equal( t.easing(), t );

	ok( t.interpolation() instanceof TWEEN.Tween );
	equal( t.interpolation(), t );

	ok( t.chain() instanceof TWEEN.Tween );
	equal( t.chain(), t );

	ok( t.onStart() instanceof TWEEN.Tween );
	equal( t.onStart(), t );

	ok( t.onUpdate() instanceof TWEEN.Tween );
	equal( t.onUpdate(), t );

	ok( t.onComplete() instanceof TWEEN.Tween );
	equal( t.onComplete(), t );
});

test( "Tween existing property", function() {

	var obj = { x: 1 },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );
	t.start( 0 );
	t.update( 1000 );

	deepEqual( obj.x, 2 );

});

test( "Tween non-existing property", function() {

	var obj = { x: 1 },
		t = new TWEEN.Tween( obj );

	t.to( { y: 0 }, 1000 );
	t.start( 0 );
	t.update( 1000 );
	
	deepEqual( obj.y, undefined );

});

test( "Tween non-null property", function() {

	var obj = { x: 1 },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );
	t.start( 0 );
	t.update( 1000 );
	
	deepEqual( obj.x, 2 );
	ok( obj.x !== null );

});

test( "Tween null property", function() {

	var obj = { },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );
	t.start( 0 );
	t.update( 1000 );
	
	deepEqual( obj.x, undefined );

});

test( "Test TWEEN.Tween.start()", function() {

	var obj = { },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );

	TWEEN.removeAll();
	equal( TWEEN.getAll().length, 0 ); // TODO move to TWEEN test

	t.start( 0 );

	equal( TWEEN.getAll().length, 1 ); // TODO ditto
	equal( TWEEN.getAll()[0], t );

});


test( "Test TWEEN.Tween.stop()", function() {

	var obj = { },
		t = new TWEEN.Tween( obj );

	t.to( { x: 2 }, 1000 );

	TWEEN.removeAll();

	t.start();
	t.stop();

	equal( TWEEN.getAll().length, 0 );

});
