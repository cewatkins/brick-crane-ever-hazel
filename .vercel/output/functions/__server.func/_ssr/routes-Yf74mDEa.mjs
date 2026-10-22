import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Camera, n as RotateCcw, r as Plane } from "../_libs/lucide-react.mjs";
import { C as Scene, E as Vector3, S as SRGBColorSpace, T as Timer, _ as MeshStandardMaterial, a as CircleGeometry, b as PlaneGeometry, c as CylinderGeometry, d as Group, f as HemisphereLight, g as MeshBasicMaterial, h as Mesh, i as CanvasTexture, l as DirectionalLight, m as Matrix4, n as AmbientLight, o as Color, p as InstancedMesh, r as BoxGeometry, s as ConeGeometry, t as WebGLRenderer, u as Fog, v as Object3D, w as SphereGeometry, x as RepeatWrapping, y as PerspectiveCamera } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Yf74mDEa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Phase 0 flight model for a 172-class trainer.
*
* Reduced-order and coordinated on purpose: coefficient build-up lives in
* JSBSim later, compiled once and run on both sides. This file is the
* contract the renderer and (later) the room server both step.
* Pure numbers — no rendering, no DOM — so a headless tick can audit it.
*
* Axes (three.js world, Y up):
*   yaw 0 faces −Z. +yaw is a left turn (CCW about +Y).
*   +pitch is nose up. +roll is left wing down.
*   Aileron +1 rolls left. Elevator +1 is pull (nose up). Rudder +1 yaws left.
*/
var FIXED_DT = 1 / 60;
var G = 9.80665;
var MASS = 1043;
var WING_AREA = 16.2;
var GEAR_HEIGHT = 1.55;
var THRUST_MAX = 2500;
var RWY_LENGTH = 2400;
function clamp$1(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
function wrapPi(a) {
	let x = a;
	while (x > Math.PI) x -= Math.PI * 2;
	while (x < -Math.PI) x += Math.PI * 2;
	return x;
}
function headingToYaw(hdgDeg) {
	return -hdgDeg * Math.PI / 180;
}
function yawToHeading(yaw) {
	return (-yaw * 180 / Math.PI + 360) % 360;
}
var RWY_YAW = headingToYaw(280);
var _windSpeed = 4.115552;
var _windYaw = headingToYaw(280);
/** Air-mass velocity. Wind FROM 280 blows opposite the runway heading. */
var WIND_X = Math.sin(_windYaw) * _windSpeed;
var WIND_Z = Math.cos(_windYaw) * _windSpeed;
function rodrigues(v, axis, ang) {
	const c = Math.cos(ang);
	const s = Math.sin(ang);
	const dot = v.x * axis.x + v.y * axis.y + v.z * axis.z;
	const cx = axis.y * v.z - axis.z * v.y;
	const cy = axis.z * v.x - axis.x * v.z;
	const cz = axis.x * v.y - axis.y * v.x;
	return {
		x: v.x * c + cx * s + axis.x * dot * (1 - c),
		y: v.y * c + cy * s + axis.y * dot * (1 - c),
		z: v.z * c + cz * s + axis.z * dot * (1 - c)
	};
}
/** Body basis. f is the nose (+Z of the mesh), r is the right wing, u is cabin-up. */
function basis(yaw, pitch, roll) {
	let f = {
		x: -Math.sin(yaw),
		y: 0,
		z: -Math.cos(yaw)
	};
	let r = {
		x: Math.cos(yaw),
		y: 0,
		z: -Math.sin(yaw)
	};
	let u = {
		x: 0,
		y: 1,
		z: 0
	};
	f = rodrigues(f, r, pitch);
	u = rodrigues(u, r, pitch);
	r = rodrigues(r, f, -roll);
	u = rodrigues(u, f, -roll);
	return {
		f,
		r,
		u
	};
}
function runwayForward() {
	const { f } = basis(RWY_YAW, 0, 0);
	return f;
}
function runwayRight() {
	const { r } = basis(RWY_YAW, 0, 0);
	return r;
}
function runwayCenter() {
	const f = runwayForward();
	return {
		x: 0 + f.x * (RWY_LENGTH * .5),
		y: 0,
		z: 0 + f.z * (RWY_LENGTH * .5)
	};
}
function rhoAt(agl) {
	return 1.225 * Math.exp(-(870 + Math.max(0, agl)) / 8500);
}
function flapCL(flaps) {
	if (flaps === 10) return .22;
	if (flaps === 20) return .4;
	if (flaps === 30) return .55;
	return 0;
}
function flapCD(flaps) {
	if (flaps === 10) return .015;
	if (flaps === 20) return .03;
	if (flaps === 30) return .05;
	return 0;
}
function createShip(init) {
	return {
		x: 0,
		y: GEAR_HEIGHT,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		yaw: RWY_YAW,
		pitch: 0,
		roll: 0,
		rollRate: 0,
		pitchRate: 0,
		throttle: 0,
		rpm: 650,
		onGround: true,
		crashed: false,
		crashReason: "",
		tas: 0,
		iasKt: 0,
		tasKt: 0,
		altFt: 2854.3308,
		aglFt: 0,
		vsiFpm: 0,
		heading: 280,
		alphaDeg: 0,
		stalled: false,
		...init
	};
}
function createPlayer() {
	const f = runwayForward();
	const back = 90;
	return createShip({
		id: "self",
		callsign: "N172FD",
		x: 0 + f.x * back,
		y: GEAR_HEIGHT,
		z: 0 + f.z * back,
		yaw: RWY_YAW
	});
}
/** Left pattern, already established on a 1,000 ft orbit so the field is never empty. */
function createTraffic() {
	const c = runwayCenter();
	const R = 1200;
	const ang = .9;
	const x = c.x + Math.sin(ang) * R;
	const z = c.z + Math.cos(ang) * R;
	const dx = x - c.x;
	const dz = z - c.z;
	const yaw = Math.atan2(-dx / R, -dz / R) + Math.PI / 2;
	const { f } = basis(yaw, .04, .22);
	const speed = 46;
	return createShip({
		id: "tg",
		callsign: "N344TG",
		x,
		y: 305,
		z,
		yaw,
		pitch: .05,
		roll: .22,
		vx: f.x * speed,
		vy: .2,
		vz: f.z * speed,
		throttle: .68,
		onGround: false,
		rpm: 2200
	});
}
function refreshInstruments(ship, tas, rho, alpha, stalled) {
	const ias = tas * Math.sqrt(rho / 1.225);
	ship.tas = tas;
	ship.tasKt = tas * 1.943844;
	ship.iasKt = ias * 1.943844;
	ship.altFt = (870 + ship.y) * 3.28084;
	ship.aglFt = ship.y * 3.28084;
	ship.vsiFpm = ship.vy * 196.8504;
	ship.heading = yawToHeading(ship.yaw);
	ship.alphaDeg = alpha * 180 / Math.PI;
	ship.stalled = stalled;
}
/**
* One fixed step. `dt` must be FIXED_DT (the loop accumulates).
* Returns nothing; mutates the ship. Deterministic for a given input stream.
*/
function step(ship, input, dt) {
	if (ship.crashed) return;
	const lever = clamp$1(input.throttle, 0, 1);
	ship.throttle += (lever - ship.throttle) * Math.min(1, dt * 3.2);
	const rho = rhoAt(ship.y);
	const ax = ship.vx - WIND_X;
	const ay = ship.vy;
	const az = ship.vz - WIND_Z;
	const tas = Math.hypot(ax, ay, az);
	const { f, u } = basis(ship.yaw, ship.pitch, ship.roll);
	const vFwd = ax * f.x + ay * f.y + az * f.z;
	const vUp = ax * u.x + ay * u.y + az * u.z;
	const alpha = Math.atan2(-vUp, Math.max(vFwd, .75));
	const stallA = input.flaps > 0 ? .3 : .26;
	let cl = .2 + 5 * alpha + flapCL(input.flaps);
	const stalled = alpha > stallA && !ship.onGround && tas > 20;
	if (alpha > stallA) cl *= .62;
	cl = clamp$1(cl, -.35, input.flaps > 0 ? 2.05 : 1.62);
	const cd = .03 + .055 * cl * cl + flapCD(input.flaps);
	const q = .5 * rho * tas * tas;
	const lift = q * WING_AREA * cl;
	const drag = q * WING_AREA * cd;
	const thrust = ship.throttle * THRUST_MAX * (1 - .4 * Math.min(tas, 85) / 85);
	let lx = u.x;
	let ly = u.y;
	let lz = u.z;
	const airMag = Math.max(tas, .001);
	const hx = ax / airMag;
	const hy = ay / airMag;
	const hz = az / airMag;
	const along = lx * hx + ly * hy + lz * hz;
	lx -= hx * along;
	ly -= hy * along;
	lz -= hz * along;
	let lm = Math.hypot(lx, ly, lz);
	if (lm < 1e-4) {
		lx = 0;
		ly = 1;
		lz = 0;
		lm = 1;
	}
	lx /= lm;
	ly /= lm;
	lz /= lm;
	const fx = thrust * f.x + lift * lx + drag * -hx;
	const fy = thrust * f.y + lift * ly + drag * -hy - MASS * G;
	const fz = thrust * f.z + lift * lz + drag * -hz;
	const ail = clamp$1(input.aileron, -1, 1);
	const ele = clamp$1(input.elevator, -1, 1);
	const rud = clamp$1(input.rudder, -1, 1);
	const rotate = ship.onGround && ele > .2 && tas > 26;
	if (ship.onGround && !rotate) {
		ship.y = GEAR_HEIGHT;
		ship.vy = 0;
	}
	if (!(ship.onGround && !rotate)) {
		ship.vx += fx / MASS * dt;
		ship.vy += fy / MASS * dt;
		ship.vz += fz / MASS * dt;
	} else {
		const brake = clamp$1(input.brake, 0, 1);
		const mu = .02 + brake * .45;
		const hspeed = Math.hypot(ship.vx, ship.vz);
		ship.vx += fx / MASS * dt;
		ship.vz += fz / MASS * dt;
		if (hspeed > .08) {
			const nx = ship.vx / Math.max(hspeed, .001);
			const nz = ship.vz / Math.max(hspeed, .001);
			const decel = Math.min(mu * G, hspeed / dt);
			ship.vx -= nx * decel * dt;
			ship.vz -= nz * decel * dt;
		} else if (brake > .15 && thrust < 400) {
			ship.vx = 0;
			ship.vz = 0;
		}
		ship.vy = 0;
	}
	ship.x += ship.vx * dt;
	ship.y += ship.vy * dt;
	ship.z += ship.vz * dt;
	if (ship.y <= 1.55 && ship.vy <= .15) {
		const impact = ship.onGround ? 0 : -ship.vy;
		const bad = !ship.onGround && (ship.vy < -6.2 || Math.abs(ship.roll) > .62 || ship.pitch < -.22 && tas > 18);
		ship.y = GEAR_HEIGHT;
		ship.vy = 0;
		if (bad || impact > 6.2) {
			ship.crashed = true;
			ship.crashReason = Math.abs(ship.roll) > .62 ? "Wing strike" : ship.pitch < -.22 ? "Prop strike" : "Hard landing";
			ship.onGround = true;
			refreshInstruments(ship, tas, rho, alpha, false);
			return;
		}
		ship.onGround = true;
	} else ship.onGround = false;
	const authority = clamp$1((tas - 6) / 24, .08, 1);
	if (ship.onGround) {
		const targetPitch = rotate ? clamp$1(.04 + ele * .16, 0, .2) : 0;
		ship.pitch += (targetPitch - ship.pitch) * Math.min(1, dt * 3.5);
		ship.roll += (0 - ship.roll) * Math.min(1, dt * 6);
		const steer = clamp$1(rud + ail * .9, -1, 1);
		const sf = clamp$1(Math.hypot(ship.vx, ship.vz) / 14, .4, 1);
		ship.yaw += steer * 1.45 * sf * dt;
		ship.rollRate = 0;
		ship.pitchRate = 0;
	} else {
		const handsOff = Math.abs(ail) < .08 ? .4 : 0;
		const rollTarget = ail * 1.05 * (.45 + .55 * authority) - ship.roll * handsOff;
		ship.rollRate += (rollTarget - ship.rollRate) * Math.min(1, dt * 4);
		ship.roll += ship.rollRate * dt;
		ship.roll = clamp$1(ship.roll, -1.05, 1.05);
		const qCmd = clamp$1((clamp$1(Math.atan2(ay, Math.max(Math.hypot(ax, az), 2)) + (.05 + ele * .13 + (input.flaps > 0 ? .025 : 0) - clamp$1(ship.vy, -10, 10) * .006), -.3, .34) - ship.pitch) * 1.8, -.45, .45);
		ship.pitchRate += (qCmd - ship.pitchRate) * Math.min(1, dt * 4);
		ship.pitch += ship.pitchRate * dt;
		ship.pitch = clamp$1(ship.pitch, -.42, .4);
		const yawErr = wrapPi(Math.atan2(-(ship.vx - WIND_X), -(ship.vz - WIND_Z)) - ship.yaw);
		ship.yaw += (yawErr * 1.7 + rud * .5 * authority) * dt;
		if (stalled) ship.roll += .25 * dt * (ship.roll >= 0 ? 1 : -1);
	}
	const rpmTarget = 620 + ship.throttle * 1780;
	ship.rpm += (rpmTarget - ship.rpm) * Math.min(1, dt * 1.6);
	refreshInstruments(ship, Math.hypot(ship.vx - WIND_X, ship.vy, ship.vz - WIND_Z), rho, alpha, stalled);
}
/** Holds a left orbit at pattern altitude. Inputs only — same step() as the player. */
function patternPilot(ship) {
	const c = runwayCenter();
	const R = 1200;
	const dx = ship.x - c.x;
	const dz = ship.z - c.z;
	const dist = Math.hypot(dx, dz) || 1;
	const outwardYaw = Math.atan2(-dx / dist, -dz / dist);
	const radial = clamp$1((dist - R) / R, -.45, .45);
	const yawErr = wrapPi(outwardYaw + Math.PI / 2 + radial * .8 - ship.yaw);
	const altErr = 305 - ship.y;
	const spdErr = 46 - ship.tas;
	const bankTarget = clamp$1(yawErr * .85, -.42, .42);
	const climb = clamp$1(altErr * .0035, -.1, .14);
	return {
		aileron: clamp$1((bankTarget - ship.roll) * 2.4 - ship.rollRate * .3, -1, 1),
		elevator: clamp$1((.045 + climb - ship.pitch) * 1.6 - ship.vy * .045, -1, 1),
		rudder: clamp$1(yawErr * .25, -.35, .35),
		throttle: clamp$1(.7 + spdErr * .03 + altErr * 8e-4, .4, 1),
		brake: 0,
		flaps: 0
	};
}
function placeAirborne(ship) {
	const f = runwayForward();
	const r = runwayRight();
	ship.x = 0 + f.x * 1400 - r.x * 40;
	ship.y = 220;
	ship.z = 0 + f.z * 1400 - r.z * 40;
	ship.yaw = RWY_YAW;
	ship.pitch = .06;
	ship.roll = 0;
	ship.rollRate = 0;
	ship.pitchRate = 0;
	const sp = 48;
	ship.vx = f.x * sp + WIND_X;
	ship.vy = 1;
	ship.vz = f.z * sp + WIND_Z;
	ship.throttle = .75;
	ship.onGround = false;
	ship.crashed = false;
	ship.crashReason = "";
}
var _m = new Matrix4();
var _x = new Vector3();
var _y = new Vector3();
var _z = new Vector3();
var _desired = new Vector3();
var _look = new Vector3();
var _fwd = new Vector3();
function applyAttitude(obj, ship) {
	const b = basis(ship.yaw, ship.pitch, ship.roll);
	_x.set(b.r.x, b.r.y, b.r.z);
	_y.set(b.u.x, b.u.y, b.u.z);
	_z.set(b.f.x, b.f.y, b.f.z);
	_m.makeBasis(_x, _y, _z);
	obj.quaternion.setFromRotationMatrix(_m);
	obj.position.set(ship.x, ship.y, ship.z);
}
function paintRunway() {
	const c = document.createElement("canvas");
	c.width = 128;
	c.height = 1024;
	const g = c.getContext("2d");
	if (!g) throw new Error("no 2d context");
	g.fillStyle = "#3c4148";
	g.fillRect(0, 0, 128, 1024);
	for (let i = 0; i < 400; i++) {
		g.fillStyle = Math.random() > .5 ? "#343940" : "#454b54";
		g.fillRect(Math.random() * 128, Math.random() * 1024, 3, 2);
	}
	g.fillStyle = "#f3f1ea";
	g.fillRect(5, 0, 3, 1024);
	g.fillRect(120, 0, 3, 1024);
	for (let y = 24; y < 1e3; y += 40) g.fillRect(61, y, 6, 20);
	g.fillRect(16, 36, 96, 10);
	g.fillRect(16, 978, 96, 10);
	g.font = "700 72px 'IBM Plex Sans', sans-serif";
	g.textAlign = "center";
	g.textBaseline = "middle";
	g.save();
	g.translate(64, 150);
	g.rotate(Math.PI);
	g.fillText("28", 0, 0);
	g.restore();
	g.save();
	g.translate(64, 874);
	g.fillText("10", 0, 0);
	g.restore();
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	tex.anisotropy = 8;
	return tex;
}
function paintGround() {
	const c = document.createElement("canvas");
	c.width = 512;
	c.height = 512;
	const g = c.getContext("2d");
	if (!g) throw new Error("no 2d context");
	g.fillStyle = "#c2b07a";
	g.fillRect(0, 0, 512, 512);
	for (let i = 0; i < 70; i++) {
		g.fillStyle = i % 2 ? "#8e9960" : "#d2c08a";
		g.globalAlpha = .4;
		g.beginPath();
		g.ellipse(Math.random() * 512, Math.random() * 512, 18 + Math.random() * 60, 10 + Math.random() * 24, Math.random() * 3, 0, Math.PI * 2);
		g.fill();
	}
	g.globalAlpha = .22;
	for (let i = 0; i < 1800; i++) {
		g.fillStyle = Math.random() > .5 ? "#6e6246" : "#efe0a8";
		g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
	}
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	tex.wrapS = RepeatWrapping;
	tex.wrapT = RepeatWrapping;
	tex.repeat.set(48, 48);
	tex.anisotropy = 8;
	return tex;
}
function buildTrainer(stripe) {
	const g = new Group();
	const white = new MeshStandardMaterial({
		color: 16052714,
		roughness: .48,
		metalness: .04
	});
	const accent = new MeshStandardMaterial({
		color: stripe,
		roughness: .45,
		metalness: .08
	});
	const dark = new MeshStandardMaterial({
		color: 2303531,
		roughness: .62,
		metalness: .2
	});
	const glass = new MeshStandardMaterial({
		color: 12047582,
		roughness: .08,
		metalness: .45,
		transparent: true,
		opacity: .55
	});
	const rubber = new MeshStandardMaterial({
		color: 1710618,
		roughness: .9
	});
	const fuse = new Mesh(new SphereGeometry(.62, 22, 16), white);
	fuse.scale.set(.92, .78, 5.15);
	fuse.position.set(0, .02, -.15);
	g.add(fuse);
	const belly = new Mesh(new BoxGeometry(.16, .08, 4.4), accent);
	belly.position.set(0, .42, -.05);
	g.add(belly);
	const cabin = new Mesh(new SphereGeometry(.46, 16, 12), glass);
	cabin.scale.set(.92, .72, 1.35);
	cabin.position.set(0, .38, .72);
	g.add(cabin);
	const cowl = new Mesh(new CylinderGeometry(.42, .48, .85, 16), white);
	cowl.rotation.x = Math.PI / 2;
	cowl.position.set(0, -.02, 1.85);
	g.add(cowl);
	const wingGeo = new BoxGeometry(5.15, .08, 1.42);
	const left = new Mesh(wingGeo, white);
	left.position.set(-2.7, .78, .15);
	left.rotation.z = -.045;
	const right = new Mesh(wingGeo, white);
	right.position.set(2.7, .78, .15);
	right.rotation.z = .045;
	g.add(left, right);
	const tipGeo = new BoxGeometry(.18, .1, 1.5);
	const tipL = new Mesh(tipGeo, accent);
	tipL.position.set(-5.2, .9, .15);
	const tipR = new Mesh(tipGeo, accent);
	tipR.position.set(5.2, .66, .15);
	g.add(tipL, tipR);
	const strutGeo = new CylinderGeometry(.025, .025, 1.05, 6);
	for (const side of [-1, 1]) {
		const strut = new Mesh(strutGeo, dark);
		strut.position.set(side * 1.7, .22, .05);
		strut.rotation.z = side * .18;
		g.add(strut);
	}
	const hstab = new Mesh(new BoxGeometry(3.15, .06, .72), white);
	hstab.position.set(0, .28, -3.15);
	const vstab = new Mesh(new BoxGeometry(.07, 1.25, .9), white);
	vstab.position.set(0, .95, -3.2);
	const rudder = new Mesh(new BoxGeometry(.05, .95, .28), accent);
	rudder.position.set(0, .95, -3.55);
	g.add(hstab, vstab, rudder);
	const legGeo = new CylinderGeometry(.035, .035, 1.15, 6);
	const wheelGeo = new CylinderGeometry(.26, .26, .14, 12);
	for (const [x, z] of [[-1.15, -.15], [1.15, -.15]]) {
		const leg = new Mesh(legGeo, dark);
		leg.position.set(x, -.55, z);
		const wheel = new Mesh(wheelGeo, rubber);
		wheel.rotation.z = Math.PI / 2;
		wheel.position.set(x, -1.22, z);
		g.add(leg, wheel);
	}
	const noseLeg = new Mesh(new CylinderGeometry(.03, .03, 1.05, 6), dark);
	noseLeg.position.set(0, -.55, 1.45);
	const noseWheel = new Mesh(new CylinderGeometry(.2, .2, .1, 12), rubber);
	noseWheel.rotation.z = Math.PI / 2;
	noseWheel.position.set(0, -1.18, 1.45);
	g.add(noseLeg, noseWheel);
	const prop = new Group();
	prop.position.set(0, -.02, 2.32);
	const bladeGeo = new BoxGeometry(.1, 1.7, .035);
	const b1 = new Mesh(bladeGeo, dark);
	const b2 = new Mesh(bladeGeo, dark);
	b2.rotation.z = Math.PI / 2;
	prop.add(b1, b2);
	g.add(prop);
	const spinner = new Mesh(new ConeGeometry(.1, .28, 12), dark);
	spinner.rotation.x = Math.PI / 2;
	spinner.position.set(0, -.02, 2.5);
	g.add(spinner);
	const lampMat = (color) => new MeshStandardMaterial({
		color,
		emissive: color,
		emissiveIntensity: .9,
		roughness: .4
	});
	const navL = new Mesh(new SphereGeometry(.07, 8, 8), lampMat(12863788));
	navL.position.set(-5.25, .9, .15);
	const navR = new Mesh(new SphereGeometry(.07, 8, 8), lampMat(4037204));
	navR.position.set(5.25, .66, .15);
	const beaconMat = lampMat(12863788);
	const beacon = new Mesh(new SphereGeometry(.07, 8, 8), beaconMat);
	beacon.position.set(0, 1.62, -3.15);
	g.add(navL, navR, beacon);
	g.traverse((obj) => {
		const mesh = obj;
		if (mesh.isMesh) {
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		}
	});
	return {
		group: g,
		prop,
		beacon
	};
}
function distToCenterline(x, z) {
	const f = runwayForward();
	const dx = x - 0;
	const dz = z - 0;
	const t = Math.max(0, Math.min(RWY_LENGTH, dx * f.x + dz * f.z));
	const px = 0 + f.x * t;
	const pz = 0 + f.z * t;
	return Math.hypot(x - px, z - pz);
}
function mountWorld(canvas) {
	const renderer = new WebGLRenderer({
		canvas,
		antialias: true,
		alpha: false,
		powerPreference: "high-performance"
	});
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = 4;
	renderer.toneMappingExposure = 1.25;
	renderer.shadowMap.enabled = false;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
	const scene = new Scene();
	scene.background = new Color("#9ec4d6");
	scene.fog = new Fog("#d5ddd6", 1400, 9e3);
	const camera = new PerspectiveCamera(52, 1, .25, 14e3);
	scene.add(new HemisphereLight("#e7f1f8", "#c2a36a", 1.05));
	scene.add(new AmbientLight("#fff6e8", .38));
	const sun = new DirectionalLight("#fff0d0", 2.6);
	sun.position.set(-420, 640, 280);
	scene.add(sun);
	const ground = new Mesh(new PlaneGeometry(14e3, 14e3), new MeshStandardMaterial({
		map: paintGround(),
		roughness: 1,
		metalness: 0
	}));
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	scene.add(ground);
	const f = runwayForward();
	const r = runwayRight();
	const center = runwayCenter();
	const shoulder = new Mesh(new BoxGeometry(74, .12, RWY_LENGTH + 40), new MeshStandardMaterial({
		color: "#a89878",
		roughness: 1
	}));
	{
		const b = basis(RWY_YAW, 0, 0);
		_x.set(b.r.x, b.r.y, b.r.z);
		_y.set(b.u.x, b.u.y, b.u.z);
		_z.set(b.f.x, b.f.y, b.f.z);
		_m.makeBasis(_x, _y, _z);
		shoulder.quaternion.setFromRotationMatrix(_m);
		shoulder.position.set(center.x, .06, center.z);
		shoulder.receiveShadow = true;
		scene.add(shoulder);
	}
	const rwyGeo = new PlaneGeometry(46, RWY_LENGTH);
	rwyGeo.rotateX(Math.PI / 2);
	rwyGeo.translate(0, .2, RWY_LENGTH / 2);
	const rwy = new Mesh(rwyGeo, new MeshStandardMaterial({
		map: paintRunway(),
		roughness: .92,
		metalness: .02,
		side: 2
	}));
	{
		const b = basis(RWY_YAW, 0, 0);
		_x.set(b.r.x, b.r.y, b.r.z);
		_y.set(b.u.x, b.u.y, b.u.z);
		_z.set(b.f.x, b.f.y, b.f.z);
		_m.makeBasis(_x, _y, _z);
		rwy.quaternion.setFromRotationMatrix(_m);
	}
	rwy.position.set(0, 0, 0);
	rwy.receiveShadow = true;
	scene.add(rwy);
	const taxi = new Mesh(new BoxGeometry(18, .16, 220), new MeshStandardMaterial({
		color: "#4a5058",
		roughness: .95
	}));
	{
		const b = basis(RWY_YAW, 0, 0);
		_x.set(b.r.x, b.r.y, b.r.z);
		_y.set(b.u.x, b.u.y, b.u.z);
		_z.set(b.f.x, b.f.y, b.f.z);
		_m.makeBasis(_x, _y, _z);
		taxi.quaternion.setFromRotationMatrix(_m);
		taxi.position.set(center.x + r.x * 93, .1, center.z + r.z * 93);
		scene.add(taxi);
	}
	const bldgMat = new MeshStandardMaterial({
		color: "#d9d3c6",
		roughness: .8
	});
	const roofMat = new MeshStandardMaterial({
		color: "#8d4d3a",
		roughness: .7
	});
	const glassMat = new MeshStandardMaterial({
		color: "#9ec4d4",
		roughness: .15,
		metalness: .3,
		emissive: "#1a3038",
		emissiveIntensity: .3
	});
	const terminal = new Group();
	const block = new Mesh(new BoxGeometry(34, 8, 70), bldgMat);
	block.position.y = 4;
	const roof = new Mesh(new BoxGeometry(36, .6, 72), roofMat);
	roof.position.y = 8.2;
	const tower = new Mesh(new BoxGeometry(6, 16, 6), bldgMat);
	tower.position.set(14, 8, -28);
	const cab = new Mesh(new BoxGeometry(8, 3.2, 8), glassMat);
	cab.position.set(14, 17.2, -28);
	terminal.add(block, roof, tower, cab);
	terminal.position.set(center.x + r.x * 210 + f.x * 80, 0, center.z + r.z * 210 + f.z * 80);
	{
		const b = basis(RWY_YAW, 0, 0);
		_x.set(b.r.x, b.r.y, b.r.z);
		_y.set(b.u.x, b.u.y, b.u.z);
		_z.set(b.f.x, b.f.y, b.f.z);
		_m.makeBasis(_x, _y, _z);
		terminal.quaternion.setFromRotationMatrix(_m);
	}
	terminal.traverse((o) => {
		const mesh = o;
		if (mesh.isMesh) {
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		}
	});
	scene.add(terminal);
	const hangar = new Mesh(new BoxGeometry(28, 7, 22), new MeshStandardMaterial({
		color: "#c5bfb2",
		roughness: .85
	}));
	hangar.position.set(center.x + r.x * 200 - f.x * 140, 3.5, center.z + r.z * 200 - f.z * 140);
	hangar.castShadow = true;
	hangar.receiveShadow = true;
	scene.add(hangar);
	const butteMat = new MeshStandardMaterial({
		color: "#8a7352",
		roughness: 1
	});
	const butteGeo = new ConeGeometry(1, 1, 6);
	for (const [x, z, radius, height] of [
		[
			-2200,
			-2600,
			520,
			340
		],
		[
			-900,
			-3400,
			380,
			210
		],
		[
			1600,
			-2800,
			640,
			260
		],
		[
			2800,
			-600,
			420,
			180
		],
		[
			-3e3,
			400,
			700,
			300
		]
	]) {
		const mesh = new Mesh(butteGeo, butteMat);
		mesh.scale.set(radius, height, radius);
		mesh.position.set(x, height * .5, z);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add(mesh);
	}
	const bushGeo = new ConeGeometry(1.1, 2.4, 5);
	const bushMat = new MeshStandardMaterial({
		color: "#6f7a48",
		roughness: 1
	});
	const bushes = new InstancedMesh(bushGeo, bushMat, 220);
	const dummy = new Object3D();
	let n = 0;
	let seed = 7;
	const rnd = () => {
		seed = seed * 16807 % 2147483647;
		return (seed - 1) / 2147483646;
	};
	while (n < 220) {
		const x = (rnd() - .5) * 7e3;
		const z = (rnd() - .5) * 7e3;
		if (distToCenterline(x, z) < 80) continue;
		if (Math.hypot(x - center.x - r.x * 210, z - center.z - r.z * 210) < 80) continue;
		dummy.position.set(x, 0, z);
		const s = .5 + rnd() * 1.1;
		dummy.scale.set(s, .6 + rnd() * 1.2, s);
		dummy.rotation.y = rnd() * 6;
		dummy.updateMatrix();
		bushes.setMatrixAt(n, dummy.matrix);
		n++;
	}
	bushes.instanceMatrix.needsUpdate = true;
	scene.add(bushes);
	const sockPole = new Mesh(new CylinderGeometry(.08, .1, 8, 6), new MeshStandardMaterial({
		color: "#d9d3c6",
		roughness: .6
	}));
	const sockBase = 0 - r.x * 42 + f.x * 50;
	const sockBaseZ = 0 - r.z * 42 + f.z * 50;
	sockPole.position.set(sockBase, 4, sockBaseZ);
	scene.add(sockPole);
	const sock = new Mesh(new ConeGeometry(.45, 2.4, 8), new MeshStandardMaterial({
		color: "#e24b3a",
		roughness: .7
	}));
	sock.rotation.x = Math.PI / 2;
	const windLen = Math.hypot(WIND_X, WIND_Z) || 1;
	sock.position.set(sockBase + WIND_X / windLen * 1.3, 7.6, sockBaseZ + WIND_Z / windLen * 1.3);
	sock.lookAt(sock.position.x + WIND_X, sock.position.y, sock.position.z + WIND_Z);
	scene.add(sock);
	const playerCraft = buildTrainer(1914199);
	const trafficCraft = buildTrainer(14721834);
	scene.add(playerCraft.group, trafficCraft.group);
	const blobGeo = new CircleGeometry(6, 20);
	blobGeo.rotateX(-Math.PI / 2);
	const blobMat = new MeshBasicMaterial({
		color: 1709068,
		transparent: true,
		opacity: .28,
		depthWrite: false
	});
	const blobA = new Mesh(blobGeo, blobMat);
	const blobB = new Mesh(blobGeo, blobMat.clone());
	scene.add(blobA, blobB);
	let camReady = false;
	let elapsed = 0;
	function resize() {
		const w = canvas.clientWidth || 1;
		const h = canvas.clientHeight || 1;
		renderer.setSize(w, h, false);
		camera.aspect = w / Math.max(h, 1);
		camera.updateProjectionMatrix();
	}
	function placeBlob(blob, ship) {
		blob.position.set(ship.x, .35, ship.z);
		const s = Math.max(.35, 1.15 - ship.y / 90);
		blob.scale.setScalar(s);
		blob.material.opacity = Math.max(0, .32 - ship.y / 240);
	}
	function render(player, traffic, dt, cam) {
		elapsed += dt;
		applyAttitude(playerCraft.group, player);
		applyAttitude(trafficCraft.group, traffic);
		playerCraft.prop.rotation.z += player.rpm / 60 * Math.PI * 2 * dt;
		trafficCraft.prop.rotation.z += traffic.rpm / 60 * Math.PI * 2 * dt;
		const blink = Math.sin(elapsed * 5.2) > .55 ? 1.6 : .05;
		playerCraft.beacon.material.emissiveIntensity = blink;
		trafficCraft.beacon.material.emissiveIntensity = blink;
		placeBlob(blobA, player);
		placeBlob(blobB, traffic);
		const b = basis(player.yaw, player.pitch, player.roll);
		_fwd.set(b.f.x, 0, b.f.z);
		if (_fwd.lengthSq() < 1e-4) _fwd.set(0, 0, -1);
		_fwd.normalize();
		if (cam === "tower") {
			_desired.set(center.x + r.x * 260, 28, center.z + r.z * 260);
			_look.set(player.x, player.y + 2, player.z);
			camera.position.lerp(_desired, 1 - Math.exp(-2 * dt));
		} else if (cam === "wing") {
			_desired.set(player.x - b.r.x * 7 + b.u.x * 1.4 - _fwd.x * 1.5, player.y - b.r.y * 7 + b.u.y * 1.4 + 1.4, player.z - b.r.z * 7 + b.u.z * 1.4 - _fwd.z * 1.5);
			_look.set(player.x + _fwd.x * 40, player.y + 1, player.z + _fwd.z * 40);
			camera.position.copy(_desired);
		} else {
			_desired.set(player.x - _fwd.x * 18, player.y + 6.4, player.z - _fwd.z * 18);
			_look.set(player.x, player.y + 1.1, player.z);
			if (!camReady) {
				camera.position.copy(_desired);
				camReady = true;
			} else camera.position.lerp(_desired, 1 - Math.exp(-3.2 * dt));
		}
		if (camera.position.y < 1.6) camera.position.y = 1.6;
		camera.lookAt(_look);
		renderer.render(scene, camera);
	}
	function dispose() {
		renderer.dispose();
		scene.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh) return;
			mesh.geometry?.dispose();
			const mat = mesh.material;
			if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
			else mat?.dispose();
		});
	}
	resize();
	return {
		render,
		resize,
		dispose
	};
}
var FLAP_STEPS = [
	0,
	10,
	20,
	30
];
var CAMS = [
	"chase",
	"tower",
	"wing"
];
var CAM_LABEL = {
	chase: "Chase",
	tower: "Tower",
	wing: "Left wing"
};
function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}
function pad3(n) {
	return String(Math.round((n % 360 + 360) % 360)).padStart(3, "0");
}
function FlightSim() {
	const canvasRef = (0, import_react.useRef)(null);
	const playerRef = (0, import_react.useRef)(null);
	const trafficRef = (0, import_react.useRef)(null);
	if (playerRef.current === null) playerRef.current = createPlayer();
	if (trafficRef.current === null) trafficRef.current = createTraffic();
	const [phase, setPhase] = (0, import_react.useState)("brief");
	const phaseRef = (0, import_react.useRef)("brief");
	const [crashReason, setCrashReason] = (0, import_react.useState)("");
	const [camLabel, setCamLabel] = (0, import_react.useState)(CAM_LABEL.chase);
	const iasRef = (0, import_react.useRef)(null);
	const altRef = (0, import_react.useRef)(null);
	const vsiRef = (0, import_react.useRef)(null);
	const hdgRef = (0, import_react.useRef)(null);
	const rpmRef = (0, import_react.useRef)(null);
	const thrRef = (0, import_react.useRef)(null);
	const flapRef = (0, import_react.useRef)(null);
	const hintRef = (0, import_react.useRef)(null);
	const ballRef = (0, import_react.useRef)(null);
	const trafficRefEl = (0, import_react.useRef)(null);
	const stallRef = (0, import_react.useRef)(null);
	const keysRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const throttleRef = (0, import_react.useRef)(0);
	const flapsRef = (0, import_react.useRef)(0);
	const brakeTouch = (0, import_react.useRef)(false);
	const touch = (0, import_react.useRef)({
		ail: 0,
		ele: 0,
		owned: false,
		lever: 0
	});
	const camRef = (0, import_react.useRef)("chase");
	const stickId = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		phaseRef.current = phase;
	}, [phase]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const world = mountWorld(canvas);
		const timer = new Timer();
		let acc = 0;
		let stopped = false;
		const audio = {
			ctx: null,
			gain: null,
			filter: null,
			stall: null
		};
		function ensureAudio() {
			if (audio.ctx) {
				if (audio.ctx.state === "suspended") audio.ctx.resume();
				return;
			}
			const ctx = new AudioContext();
			const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
			const src = ctx.createBufferSource();
			src.buffer = buffer;
			src.loop = true;
			const filter = ctx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.value = 400;
			const gain = ctx.createGain();
			gain.gain.value = 1e-4;
			src.connect(filter);
			filter.connect(gain);
			gain.connect(ctx.destination);
			src.start();
			const osc = ctx.createOscillator();
			osc.type = "square";
			osc.frequency.value = 1400;
			const stall = ctx.createGain();
			stall.gain.value = 0;
			osc.connect(stall);
			stall.connect(ctx.destination);
			osc.start();
			audio.ctx = ctx;
			audio.gain = gain;
			audio.filter = filter;
			audio.stall = stall;
		}
		const onKeyDown = (e) => {
			if (e.repeat) return;
			keysRef.current.add(e.code);
			if ([
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight"
			].includes(e.code)) e.preventDefault();
			if (phaseRef.current !== "fly") return;
			if (e.code === "KeyF") {
				const i = FLAP_STEPS.indexOf(flapsRef.current);
				flapsRef.current = FLAP_STEPS[Math.min(FLAP_STEPS.length - 1, i + 1)] ?? 30;
			}
			if (e.code === "KeyG") {
				const i = FLAP_STEPS.indexOf(flapsRef.current);
				flapsRef.current = FLAP_STEPS[Math.max(0, i - 1)] ?? 0;
			}
			if (e.code === "KeyC") {
				const i = CAMS.indexOf(camRef.current);
				camRef.current = CAMS[(i + 1) % CAMS.length] ?? "chase";
				setCamLabel(CAM_LABEL[camRef.current]);
			}
			if (e.code === "KeyR") resetShip();
		};
		const onKeyUp = (e) => {
			keysRef.current.delete(e.code);
		};
		const onBlur = () => keysRef.current.clear();
		function resetShip() {
			playerRef.current = createPlayer();
			trafficRef.current = createTraffic();
			throttleRef.current = 0;
			flapsRef.current = 0;
			touch.current.owned = false;
			if (phaseRef.current === "crash") {
				phaseRef.current = "fly";
				setPhase("fly");
			}
		}
		window.__controlsTest = {
			getYaw: () => playerRef.current?.yaw ?? 0,
			getSpeed: () => {
				const p = playerRef.current;
				return p ? Math.hypot(p.vx, p.vz) : 0;
			},
			getRoll: () => playerRef.current?.roll ?? 0,
			setKeys: (codes) => {
				keysRef.current = new Set(codes);
			},
			prepRollTest: () => {
				if (!playerRef.current) return;
				placeAirborne(playerRef.current);
				throttleRef.current = .75;
				phaseRef.current = "fly";
				setPhase("fly");
			}
		};
		const loop = () => {
			if (stopped) return;
			timer.update();
			const delta = Math.min(timer.getDelta(), .25);
			acc += delta;
			let steps = 0;
			const player = playerRef.current;
			const traffic = trafficRef.current;
			if (player && traffic) {
				while (acc >= .016666666666666666 && steps < 20) {
					acc -= FIXED_DT;
					steps++;
					const flying = phaseRef.current === "fly" && !player.crashed;
					const keys = keysRef.current;
					if (flying) {
						if (keys.has("KeyW")) {
							touch.current.owned = false;
							throttleRef.current = Math.min(1, throttleRef.current + FIXED_DT * 1.6);
						}
						if (keys.has("KeyS")) {
							touch.current.owned = false;
							throttleRef.current = Math.max(0, throttleRef.current - FIXED_DT * .9);
						}
						if (touch.current.owned) throttleRef.current = touch.current.lever;
						let ail = 0;
						let ele = 0;
						let rud = 0;
						if (keys.has("KeyA") || keys.has("ArrowLeft")) ail += 1;
						if (keys.has("KeyD") || keys.has("ArrowRight")) ail -= 1;
						if (keys.has("ArrowDown")) ele += 1;
						if (keys.has("ArrowUp")) ele -= 1;
						if (keys.has("KeyQ")) rud += 1;
						if (keys.has("KeyE")) rud -= 1;
						ail = clamp(ail + touch.current.ail, -1, 1);
						ele = clamp(ele + touch.current.ele, -1, 1);
						const pads = navigator.getGamepads?.();
						if (pads) for (const pad of pads) {
							if (!pad) continue;
							if (Math.abs(pad.axes[0] ?? 0) > .12) ail = clamp(-(pad.axes[0] ?? 0), -1, 1);
							if (Math.abs(pad.axes[1] ?? 0) > .12) ele = clamp(pad.axes[1] ?? 0, -1, 1);
							if (Math.abs(pad.axes[2] ?? 0) > .18) rud = clamp(-(pad.axes[2] ?? 0), -1, 1);
							if (pad.buttons[7]?.pressed) throttleRef.current = Math.min(1, throttleRef.current + FIXED_DT);
							if (pad.buttons[6]?.pressed) throttleRef.current = Math.max(0, throttleRef.current - FIXED_DT);
						}
						const brake = keys.has("Space") || keys.has("KeyB") || brakeTouch.current ? 1 : 0;
						step(player, {
							aileron: ail,
							elevator: ele,
							rudder: rud,
							throttle: throttleRef.current,
							brake,
							flaps: flapsRef.current
						}, FIXED_DT);
						if (player.crashed) {
							phaseRef.current = "crash";
							setCrashReason(player.crashReason || "Wreck");
							setPhase("crash");
						}
					}
					step(traffic, patternPilot(traffic), FIXED_DT);
					if (traffic.crashed || traffic.y > 2500 || Math.hypot(traffic.x, traffic.z) > 8e3) trafficRef.current = createTraffic();
				}
				const ias = Math.round(player.iasKt);
				const alt = Math.round(player.altFt);
				const vsi = Math.round(player.vsiFpm / 50) * 50;
				if (iasRef.current) iasRef.current.textContent = String(ias);
				if (altRef.current) altRef.current.textContent = alt.toLocaleString("en-US");
				if (vsiRef.current) vsiRef.current.textContent = `${vsi > 0 ? "+" : ""}${vsi}`;
				if (hdgRef.current) hdgRef.current.textContent = pad3(player.heading);
				if (rpmRef.current) rpmRef.current.textContent = String(Math.round(player.rpm / 10) * 10);
				if (thrRef.current) thrRef.current.textContent = `${Math.round(throttleRef.current * 100)}%`;
				if (flapRef.current) flapRef.current.textContent = flapsRef.current === 0 ? "UP" : String(flapsRef.current);
				if (ballRef.current) {
					const pitchPx = player.pitch * (180 / Math.PI) * 1.7;
					const rollDeg = -player.roll * 180 / Math.PI;
					ballRef.current.style.transform = `translateY(${pitchPx}px) rotate(${rollDeg}deg)`;
				}
				if (stallRef.current) stallRef.current.hidden = !player.stalled;
				if (hintRef.current) {
					let hint = "";
					if (phaseRef.current === "fly" && player.onGround && player.iasKt < 50) hint = "Throttle with W. Steer with A and D.";
					else if (phaseRef.current === "fly" && player.onGround && player.iasKt >= 50) hint = "Rotate. Pull the nose up with the down arrow.";
					else if (player.stalled) hint = "Stall. Relax the back pressure. Wings level.";
					else if (phaseRef.current === "fly" && !player.onGround) hint = "Left pattern is yours. N344TG is already in it.";
					hintRef.current.textContent = hint;
				}
				if (trafficRefEl.current) {
					const dx = traffic.x - player.x;
					const dz = traffic.z - player.z;
					const nm = Math.hypot(dx, dz) / 1852;
					const dAlt = Math.round((traffic.altFt - player.altFt) / 100) * 100;
					trafficRefEl.current.textContent = `N344TG  ${nm.toFixed(1)} nm  ${dAlt > 0 ? "+" : ""}${dAlt} ft`;
				}
				if (audio.gain && audio.filter && audio.stall && audio.ctx) {
					const hz = 160 + player.rpm * .42;
					audio.filter.frequency.setTargetAtTime(hz, audio.ctx.currentTime, .05);
					const vol = phaseRef.current === "brief" ? 1e-4 : .015 + throttleRef.current * .07;
					audio.gain.gain.setTargetAtTime(vol, audio.ctx.currentTime, .08);
					audio.stall.gain.setTargetAtTime(player.stalled ? .03 : 0, audio.ctx.currentTime, .05);
				}
				world.render(player, traffic, delta, camRef.current);
			}
		};
		const id = { current: 0 };
		const frame = () => {
			loop();
			if (!stopped) id.current = requestAnimationFrame(frame);
		};
		id.current = requestAnimationFrame(frame);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("blur", onBlur);
		const onResize = () => world.resize();
		window.addEventListener("resize", onResize);
		const ro = new ResizeObserver(() => world.resize());
		ro.observe(canvas);
		const startAudio = () => ensureAudio();
		canvas.parentElement?.addEventListener("pointerdown", startAudio);
		return () => {
			stopped = true;
			cancelAnimationFrame(id.current);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", onBlur);
			window.removeEventListener("resize", onResize);
			ro.disconnect();
			canvas.parentElement?.removeEventListener("pointerdown", startAudio);
			if (window.__controlsTest) delete window.__controlsTest;
			world.dispose();
			audio.ctx?.close();
		};
	}, []);
	function start() {
		phaseRef.current = "fly";
		setPhase("fly");
	}
	function resetFromCrash() {
		playerRef.current = createPlayer();
		trafficRef.current = createTraffic();
		throttleRef.current = 0;
		flapsRef.current = 0;
		touch.current = {
			ail: 0,
			ele: 0,
			owned: false,
			lever: 0
		};
		phaseRef.current = "fly";
		setPhase("fly");
	}
	function cycleCam() {
		const i = CAMS.indexOf(camRef.current);
		camRef.current = CAMS[(i + 1) % CAMS.length] ?? "chase";
		setCamLabel(CAM_LABEL[camRef.current]);
	}
	function moreFlaps(dir) {
		const i = FLAP_STEPS.indexOf(flapsRef.current);
		flapsRef.current = FLAP_STEPS[clamp(i + dir, 0, FLAP_STEPS.length - 1)] ?? 0;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full touch-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto rounded-md border border-border bg-bg/80 px-3 py-2 backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-widest text-primary",
							children: "FIELD 28"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm text-fg",
							children: "N172FD"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "RWY 28 · wind 280/08 · 2,871 ft"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto rounded-md border border-border bg-bg/80 px-3 py-2 text-right backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted",
							children: "TRAFFIC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							ref: trafficRefEl,
							className: "font-mono text-sm text-fg",
							children: "N344TG"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: cycleCam,
							className: "mt-1 inline-flex items-center gap-1 text-xs text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
								className: "size-3.5",
								"aria-hidden": true
							}), camLabel]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: stallRef,
				hidden: true,
				className: "pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 rounded-sm bg-danger px-4 py-1 font-mono text-sm tracking-widest text-fg",
				children: "STALL"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				ref: hintRef,
				className: "pointer-events-none absolute top-28 right-4 left-4 text-center font-mono text-xs text-fg sm:top-auto sm:bottom-36"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2 sm:justify-center sm:p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex max-w-full items-end gap-2 overflow-x-auto rounded-md border border-border bg-bg/85 px-2 py-2 backdrop-blur-sm sm:gap-4 sm:px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
							k: "KIAS",
							vRef: iasRef,
							value: "0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ai",
							"aria-hidden": true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: ballRef,
									className: "ai-ball"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ai-wings" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ai-dot" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
							k: "ALT",
							vRef: altRef,
							value: "2,871"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
							k: "VSI",
							vRef: vsiRef,
							value: "0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
							k: "HDG",
							vRef: hdgRef,
							value: "280"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
							k: "RPM",
							vRef: rpmRef,
							value: "620"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
							k: "THR",
							vRef: thrRef,
							value: "0%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
							k: "FLAP",
							vRef: flapRef,
							value: "UP"
						})
					]
				})
			}),
			phase === "fly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-24 left-3 flex touch-none flex-col items-center gap-2 sm:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative size-28 rounded-full border border-border bg-bg/50",
					onPointerDown: (e) => {
						e.currentTarget.setPointerCapture(e.pointerId);
						stickId.current = e.pointerId;
					},
					onPointerMove: (e) => {
						if (e.pointerId !== stickId.current) return;
						const rect = e.currentTarget.getBoundingClientRect();
						const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width * .34);
						const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height * .34);
						touch.current.ail = clamp(-dx, -1, 1);
						touch.current.ele = clamp(dy, -1, 1);
					},
					onPointerUp: (e) => {
						if (e.pointerId !== stickId.current) return;
						stickId.current = null;
						touch.current.ail = 0;
						touch.current.ele = 0;
					},
					role: "slider",
					"aria-label": "Yoke",
					"aria-valuemin": -1,
					"aria-valuemax": 1,
					"aria-valuenow": 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] tracking-widest text-muted",
					children: "YOKE"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 bottom-24 flex touch-none flex-col items-center gap-2 sm:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-28 w-12 rounded-full border border-border bg-bg/50",
					onPointerDown: (e) => {
						e.currentTarget.setPointerCapture(e.pointerId);
						const rect = e.currentTarget.getBoundingClientRect();
						const t = 1 - (e.clientY - rect.top) / rect.height;
						touch.current.owned = true;
						touch.current.lever = clamp(t, 0, 1);
					},
					onPointerMove: (e) => {
						if (!touch.current.owned) return;
						const rect = e.currentTarget.getBoundingClientRect();
						const t = 1 - (e.clientY - rect.top) / rect.height;
						touch.current.lever = clamp(t, 0, 1);
					},
					role: "slider",
					"aria-label": "Throttle",
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "size-11 rounded-md border border-border bg-bg/80 text-xs",
							onClick: () => moreFlaps(-1),
							children: "Flap−"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "size-11 rounded-md border border-border bg-bg/80 text-xs",
							onClick: () => moreFlaps(1),
							children: "Flap+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "size-11 rounded-md border border-border bg-bg/80 text-xs",
							onPointerDown: () => {
								brakeTouch.current = true;
							},
							onPointerUp: () => {
								brakeTouch.current = false;
							},
							onPointerLeave: () => {
								brakeTouch.current = false;
							},
							children: "Brk"
						})
					]
				})]
			})] }),
			phase === "brief" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-20 flex items-end justify-center overflow-y-auto bg-bg/40 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, {
								className: "size-4",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs tracking-widest",
								children: "PATTERN TRAINER"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-sans text-3xl font-semibold tracking-tight text-fg",
							children: "Field 28"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: "C172-class trainer on runway 28 at a Boise-elevation field. One flight model steps both your airplane and the pattern ship. You send it inputs. It owns the state."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs text-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "W / S"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Throttle up / down" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "A / D"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Bank left / right" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "↓ / ↑"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Pull / push" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Q / E"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Rudder left / right" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "F / G"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Flaps down / up" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Space · C · R"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Brake · camera · reset" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: start,
							className: "mt-5 w-full rounded-md bg-primary px-4 py-3 font-medium text-bg",
							children: "Start engines"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs leading-relaxed text-muted",
							children: "Phase 0 proof. Not a Cessna product — that name belongs to Textron. Public 172 handbook numbers, reduced-order aero. JSBSim comes later, same file on both sides of the wire."
						})
					]
				})
			}),
			phase === "crash" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-20 flex items-center justify-center bg-bg/70 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-lg border border-danger bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-widest text-danger",
							children: "OFF THE RUNWAY"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-2xl font-semibold text-fg",
							children: crashReason
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "The airplane is done. The pattern ship is not."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: resetFromCrash,
							className: "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-bg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
								className: "size-4",
								"aria-hidden": true
							}), "Reset on 28"]
						})
					]
				})
			})
		]
	});
}
function Readout({ k, value, vRef }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-12 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] tracking-widest text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			ref: vRef,
			className: "font-mono text-sm text-fg sm:text-base",
			children: value
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlightSim, {});
}
//#endregion
export { Home as component };
