cc.Class({
    extends: cc.Component,

    properties: {
        line: cc.Node,
        carControl: cc.Node,
        carHead: cc.Node,
        carTail: cc.Node,

        tireGroup: cc.Node,
        tireStreak: cc.Prefab,
        posTireLeft: cc.Node,
        posTireRight: cc.Node,

        cameraNode: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        //cc.director.setDisplayStats(false);
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, 0);

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.addTireStreak();
        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.delTireStreak();
        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.delTireStreak();
        }.bind(this));
    },

    addTireStreak () {
        if (!this.tireStreak_left) {
            this.tireStreak_left = cc.instantiate(this.tireStreak);
            this.tireStreak_left.parent = this.tireGroup;
            this.tireStreak_right = cc.instantiate(this.tireStreak);
            this.tireStreak_right.parent = this.tireGroup;
        }
    },

    delTireStreak () {
        if (!!this.tireStreak_left) {
            this.tireStreak_left.getComponent('TireStreak').delayDestroy();
            this.tireStreak_left = null;
            this.tireStreak_right.getComponent('TireStreak').delayDestroy();
            this.tireStreak_right = null;
        }
    },

    updateTireStreak () {
        if (!!this.tireStreak_left) {
            this.tireStreak_left.position = this.posTireLeft.convertToWorldSpace(cc.v2(0, 0)).sub(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
            this.tireStreak_right.position = this.posTireRight.convertToWorldSpace(cc.v2(0, 0)).sub(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        }
    },

    goFront () {
        let speedX = 2000 * Math.sin(-this.carHead.angle * Math.PI / 180);
        let speedY = 2000 * Math.cos(-this.carHead.angle * Math.PI / 180);
        this.carHead.getComponent(cc.RigidBody).linearVelocity = cc.v2(speedX, speedY);
    },

    // called every frame
    update: function (dt) {
        this.goFront();
        this.carHead.angle = -cc.misc.radiansToDegrees( (cc.v2(this.carHead.position.x, this.carHead.position.y).sub( cc.v2(this.carTail.position.x, this.carTail.position.y) )).signAngle(cc.v2(0, 1)));
        this.line.angle = -cc.misc.radiansToDegrees((cc.v2(this.carControl.position.x, this.carControl.position.y).sub(cc.v2(this.carHead.position.x, this.carHead.position.y))).signAngle(cc.v2(1, 0)));
        this.updateTireStreak();

        //this.cameraNode.position = this.carHead.position;

        // this.carTail.getComponent(cc.MotionStreak)._onNodePositionChanged();
    },
});
