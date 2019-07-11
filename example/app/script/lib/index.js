
// Setup
// -----------------------------------------------------------------------------

const browserWindow = require("electron").remote.getCurrentWindow();

class Snapping {

    constructor(params = {}) {
        // Default Configs
        this.config = Object.assign({
            snapPoints: [
                { width: 500, height: 300, },
                { width: 800, height: 300, },
                { width: 800, height: 600, },
            ],
        }, params);

        // Default State
        this.state = {
            isEnabled: false,
            mouse: {
                button: 0,
                downEvent: null,
                moveEvent: null,
            },
            screen: null,
            window: {
                ow: 0,
                oh: 0,
            },
        };

        // Bindings
        this.Handle_OnMouseDown = this.Handle_OnMouseDown.bind(this);
        this.Handle_OnMouseMove = this.Handle_OnMouseMove.bind(this);
        this.Handle_OnMouseUp = this.Handle_OnMouseUp.bind(this);
        this.Handle_Drag = this.Handle_Drag.bind(this);

        // Auto-enable
        this.enable();
    }

    attachEvents() {
        if (this.state.isEnabled) {
            return;
        }

        document.querySelector(".dragger").addEventListener("mousedown", this.Handle_OnMouseDown);
        window.addEventListener("mousemove", this.Handle_OnMouseMove);
        window.addEventListener("mouseup", this.Handle_OnMouseUp);
        window.addEventListener("mousemove", this.Handle_Drag);
    }

    detachEvents() {
        if (!this.state.isEnabled) {
            return;
        }

        document.querySelector(".dragger").removeEventListener("mousedown", this.Handle_OnMouseDown);
        window.removeEventListener("mousemove", this.Handle_OnMouseMove);
        window.removeEventListener("mouseup", this.Handle_OnMouseUp);
        window.removeEventListener("mousemove", this.Handle_Drag);
    }

    enable() {
        this.attachEvents();

        this.state.isEnabled = true;
    }

    disable() {
        this.state.isEnabled = false;
    }


    // Getters
    // -------------------------------------------------------------------------

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2));
    }


    // Event Handlers
    // -------------------------------------------------------------------------

    Handle_Drag(e) {
        const state = this.state;
        const config = this.config;

        if (state.mouse.button === 1) {
            let width = this.state.window.ow + (state.mouse.moveEvent.screenX - state.mouse.downEvent.screenX);
            let height = this.state.window.oh + (state.mouse.moveEvent.screenY - state.mouse.downEvent.screenY);
            let index = 0;
            let lastDistance = Infinity;

            if (state.isEnabled) {
                for (let i = 0; i < this.config.snapPoints.length; i++) {
                    const snapPoint = this.config.snapPoints[i];
                    const distance = this.distance(width, height, snapPoint.width, snapPoint.height);

                    if (distance < lastDistance) {
                        lastDistance = distance;
                        index = i;
                    }
                }

                // Resize browser window
                browserWindow.setSize(
                    this.config.snapPoints[index].width,
                    this.config.snapPoints[index].height,
                );
            }
        }
    }

    Handle_OnMouseDown(e) {
        this.state.mouse.button = 1;
        this.state.mouse.downEvent = e;
        this.state.window.ow = window.outerWidth;
        this.state.window.oh = window.outerHeight;
    }

    Handle_OnMouseMove(e) {
        this.state.mouse.moveEvent = e;
        this.state.screen = window.screen;
    }

    Handle_OnMouseUp(e) {
        this.state.mouse.button = 0;
        this.state.mouse.downEvent = null;
    }
}

export default Snapping;
