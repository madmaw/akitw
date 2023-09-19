# Dragon Simulator

![Cover](screenshot_small.png)

Live the life of a dragon on a small island
* fly around
* hatch eggs
* terrorise villagers
* catch and feed wildlife to your hatchlings
* set fire to hungry leopards

Controls
* Mouse: Look/Aim
* Left Mouse Button: expel contents of stomach
* Space: Jump/Flap
* Hold Space: Glide
* WASD (on ground): Move 
* W (while gliding): Turn to match camera
* Release W (while gliding and holding something): Drop 
* Shift: Walk

Flapping and gliding take the angle of the wing/body into account. Facing upward will brake, downward will accelerate, left or right will turn in that direction. Gliding is much easier to control than flying by flapping alone. Use of a mouse (not a track pad and definitely not touch/mobile) is recommended.

You can catch live prey by flying low overhead. If you do it right the dragon will automatically pick it up. Best achieved by swooping down on something on a ridgeline before it's aware you're there.

![Cover](screenshot_big.png)

Playable here https://madmaw.github.io/akitw/

## Postmortem

So I wanted to make a tribute to Geometry Wars 3 (a game I've not played, and an IP that Activision agressively defends, so _definitely_ not a clone), but 13th Century is not a theme I could shoehorn that into. I tried, believe me. I settled on a walking simulator with some spooky/horror and puzzle elements, provisionally titled A Knight In The Woods. The idea was it would be first person so I wouldn't need to have a character model, and I could devote those bytes to the environment instead. 

In preparation I'd been playing around with an [improvement over the geometry generator](https://github.com/madmaw/geom) from [RIP](https://github.com/madmaw/rip) from last year that could produce concave geometry, informed by [Salvatore Previti's postmortem of Dante](https://github.com/SalvatorePreviti/js13k-2022) from last year. It wasn't immediately obvious how it might be useful, but I kept it in mind. I also had been playing around with textures and bump maps and trying to work out how to make them seemless on procedurally generated models in the same repo.

### Collision Handling

After getting a few triangles on the screen, the first major step was to make a basic 3D physics engine. If you just have dynamic spheres and static planes, this is actually pretty easy ("easy" in that I can do it in about 10 days and it pushed me to the limit of my coding and mathematics ability) Fortunately I'd done this before in [Gunturion](https://github.com/madmaw/gunturion), but upon revisiting the code, it became pretty clear that over the intervening 5 years I'd become a better programmer and code golfer so I couldn't just copy the code wholesale. The code was also largely uncommented and I had little recollection about why I'd made some of the more interesting decisions. 

For those interested, let's say a face is a plane (described by a transformation matrix from the X/Y plane to model space) and a polygon (described by an array of 2D points on the pre-transformation plane) on that plane. And a sphere is an 3D point and a radius. If we want to detect if a sphere intersects the plane, all we need to do is transform the center point of the sphere to plane space and see if `Math.abs(transformedPoint.z) < sphere.radius`. You can extrapolate this to detect when the sphere will hit the plane based on its (transformed) velocity. By working in plane space, instead of model (or world) space, you reduce a lot of the 3D math to 2D math.

Unfortunately we also have to detect if the sphere has hit the polygon describing the face on the plane, not just the plane, which is a bit harder. If the center point of the sphere at the intersection time sits within the polygon, then we have a direct hit and no further calculations are required. We can just bounce directly off the plane. Bouncing is just done by tranforming the velocity to plane space, reversing z, then transforming the velocity back to model space. 

Even more unfortunately, we have to deal with the situation when the sphere hits the edge of the polygon and bounces off at an angle. I'm not aware of a formula for this, so I used the classic method of doing a binary search over time (there's a name for this, IDK what it is). We already know the earliest that the sphere could hit the plane, so that's our minimum time, but it's pretty easy to calculate the latest time that the sphere could be intersecting with the plane too by looking at the relative velocity. The maximum should always be intersecting with the face, the minimum should never be intersecting, then we test the mid point to see if it overlaps or not and adjust our minimum or maximum accordingly. 

So there is a dangerous assumption here, specifically that if the initial maximum value overlaps, then there is a collision, or more specifically the assumption that the opposite is true, if the initial maximum value _doesn't_ overlap, there there _isn't_ an collision. This isn't true, we can overshoot the edge of the polygon with the maximum when there is a valid time between the minimum and the maximum that would generate a collision! My solution was to just ignore that problem and let the adjoining face deal with it. The downside is, we get some pretty funky behaviour where the sphere can bounce off the back of the adjoining face in a way that you wouldn't expect. Occasionlly you'll see this in game when the dragon is running fast on flat ground: suddenly it will bounce up into the air as if it has tripped on something. 

The secret to success with this particular style of collision handling is to always have a little bit of bounce in your collisions. If you don't have the bounce, you will fall through the plane eventually due to rounding errors. I set up a few cubes adjacent to eachother and when I found a restitution value where I could wedge myself between them without any weird shaking of falling into the void, I moved on.

### Terrain Generation and Continuous Levels of Detail

With collision detection working mostly reliably I moved onto terrain generation. I'd decided it would be cool if my knight eventually walked out of the dark woods and see a bright, sunny vista. It was probably a mistake in hindsight as having a winding path through a dark, cramped forest would have allowed me to only render a small fraction of the world at a time (more on this later). I suppose this is the risk of not having a concrete plan when you start, you get sidetracked by interesting problems. In any case terrain generation is actually pretty easy to do in a small code footprint, and I used a variation of the [Diamond-Square algorithm](https://yonatankra.com/how-to-create-terrain-and-heightmaps-using-the-diamond-square-algorithm-in-javascript/).

Now I could generate an enormous amount of land there was a problem. My computer couldn't efficiently render it all! I briefly considered rendering it to a skybox that got updated as the player walked about, but it seemed like that approach would lead to a lot of lag spikes as the skybox would need to be updated pretty regularly. In the end, I settled on having multiple levels of detail that could be rendered, depending on how far away the camera is.

The world was already broken up into 2D tiles so I made the tile array 3D and each level of the array having more detailed entities. Each level has half the number of tiles across and down as the one before. Some entities could appear in multiple levels (for example, rabbits appear in levels 0, 1, 2, and 3), but the terrain geometry only ever appears in a single level and is generated on demand. This way, if we have, say, a quadrant of the island that is way off in the distance, we can just render it at a low resolution in a single draw call. 

It worked OK, but performance was still an issue. I eventually discovered a bug where I was iterating over all the tiles at level 0 at all times, and it got a bit better after that. I don't think I tried making a huge world after I fixed that bug, but in theory the engine will handle very big islands before performance degrades (note that the terrain generation code will probably not produce nice results at larger sizes, but we can render it).

### Textures

I wanted the world to look as realistic as possible, so I turned my attention to how I could apply textures to the terrain. I had the bump map shader ported over pretty quickly, but the problem was I was trying to create an organic environment with multiple biomes, so a single repeating texture just wasn't cutting it. 

I ended up having an atlas texture, which was generated from terrain information (specifically elevation and the grade of slope) and used that to populate the atlas. For terrain, red is sand, green is grass, blue is rocks. 

For the terrain textures, we actually find the texture with the highest surface in the fragment shader (on the bump map) and use that. It's quite expensive to calculate, but my graphics card manages to parallelise the calculation as far as I can tell. That said, I was restricted to a very small maximum height/depth for each texture to make it performant. I never ended up using recessed textures, so I guess that range could have been doubled. Oh well. 

The code looks up the atlas to get the sandiness/grassiness/rockiness of the pixel, then adds that value to the height of the detected bump. The texture with the highest bump wins. This way you cam have sandy grass, or rocky sand, or grassy rocks. The atlas is quite low resolution (only 1024x1024 for the entire island) but it is mipmap'd so you end up with that weird square blending effect it produces, however in this case because it is just being used as a map for another texture, if you don't think about it too much it just looks organic. 

I couldn't mipmap the terrain textures however as it stripped out a lot of the detail, but using a linear filter is really slow. I managed to find a sweet spot where for a small texture (terain textures are 512x512) only rendered for nearby tiles (resolutions 0 and 1 use linear filter, everything else mipmap) and by scaling down the height of the bumps based on their proximity to the player so there isn't a visible drop off, it forms an optical illusion where the players eye paints in the rest of the detail.

### Here be Dragons

It was around this point that I realised I'd gone way off track. Continuous levels of detail? Terrain generation? Biomes? What the hell was I thinking?? I started working on a tree generator, but I looked at the amount of space I had left and what I had written and decided that it was probably better suited to a flight simulator. When I was young, I loved the arcade game Joust. Like, LOVED. One thing that always annoyed me about it though was that you couldn't glide. Even if you held the flap button down, you eventually just dropped out of the sky. I started working on rudimentary flight.

After a while it became pretty clear that, while I had a pretty good idea what was going on with my dragon while it was flying, nobody else was going to be able to work it out. There needed to be some visual feedback on what its wings were doing, the direction of its momentum, the direction it was trying to turn, how high it was, how fast it was going, etc... I had to go 3rd person.

Goodbye my precious buffer of 5Kb, hello geometry. As it turned out, I didn't make any concave geometry, so my prep was completely unused.

The wings in particular we horrible as there were three segments that joined at strange angles and offsets. Eventually I got the magic combination of matrices in the right order and the wings looked vaguely dragon-like. The run animation where it puts its head down and charges like a pitbull was accidental, but it amused me and implied the dragon has a certain kind of personality, so I kept it.

# Geometry

The geometry comes from a few places. For the terrain, it's generated as required from the height map.

For the animals and plants, it's just a billboard that always faces the camera.

For the dragon is a bunch of convex shapes stuck together with a skeleton and some animations. The convex shapes are described using planes, but ended up being packed into strings.

### Ocean, Fog, Lasers, and Fireballs

I spent a few days trying to make a space laser kind of dragon breath attack in the shader, with limited success, then just went with a ball, also in the shader. Because fire was being done in the shader, I needed an enclosed environment to render it against, so I added a skybox (technically a cylinder since I didn't want to be bothered with dealing with the attenuation that a cube would bring). Without the skybox you wouldn't have been able to shoot above the horizon!

Then deleted all of that and just went with a geometry fireball, which looks fine. I kept the skycylinder however.

The ocean is also done in the fragment shader. Anything with a z below 0 is rendered blue. Again this relies on the skycylinder to work. 

I also wanted there to be a slight fog to give distant objects a sense of perspective. To prevent there from being a noticable difference between the sky and the fog on distant mountains, I made the fog light blue-ish. There's probably a better way?

### Game-like Experience

I had a reasonable flight simulator and some nice graphics, but no game, no incentive to fly your dragon at the limit. To be honest I never really nailed it. I would have loved to have had a big castle that you could strafe around blasting fireballs into and steal princesses and treasure from, or some knights riding ostriches, but I simply ran out of space. In the end I added some baby dragons you can feed, and some animals you can pick up and drop in your nest, which is quite challenging to do right. There are some hostiles you can burn to ash, but they're fairly limited in what they will do. 

### Stuff You Probably Didn't Notice

* The world repopulates over time if you kill everything
  * and fills up with unkillable stuff like ferns and flowers
* There is a limit on the number of animals and particles. Occasionally you'll see an animal just drop dead for no reason
* You can fly out to sea forever, but if you drop an animal too far offshore it will immediately disappear. This is because the tiles that describe the world only extend as far as the island, but the player and the camera are special cases
* There is a slight lag on the camera tracking the player. This is to help track changes in speed. The the dragon is flying fast, the camera will be further behind. If the player has flapped the camera will be below the dragon.
* Entities have a home, if you drop them on the other side of the island they should eventually make their way back to where they started
  * I'm not sure this is working correctly 
* Tigers attack other creatures and grow larger from killing them
  * There is a bug where a tiger or a human will attack a tree and grow massive from "eating" it
  * Baby dragons also grow as you feed them
* There appears to be a bug in the collision detection when standing on the top of mountains where you stand too high off the ground.
* Angling the dragon upward while gliding will air-brake, but turning left or right and angling upward does not lose much (any?) speed. I needed a way to land on the nest without just crashing into it at full speed

### Optimisations, Minifications and Omissions

* Because all the tiles have an x/y position and a radius, it is also fairly easy to work out if the tiles is in the player's field of vision and not draw it (or its entities) at all, which was a major performance improvement. 
* While not technically an optimisation, I found it helpful to have a little FPS counter in the top right corner of the screen. The goal was to keep it at above 50FPS and not to have the fan in my laptop running constantly while playing
* There was no space for audio unfortunately
* Closure Compiler (CC) is pretty good at tree shaking (removing dead code). In my experience you can just put anything you want to optionally leave out of your project behind a flag and CC will remove it if it's unused.
  * The geometry generation code was pretty large, so having a flag where I packed the generated geometry into strings, and let CC tree-shake out the unused code saved a bunch of space
  * I tried to do the same thing with animations, but it didn't help and CC broke the animation string!
* Roadroller just gets better and better, stuff that saved space a year ago (e.g. packing into strings, renaming PI to 3) barely makes an difference this time around