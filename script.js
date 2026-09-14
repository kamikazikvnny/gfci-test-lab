/* =========================================================
   document.addEventListener
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

    console.log("GFCI Test Lab loaded.");



/* =========================================================
   UNDO / REDO
========================================================= */

const undoButton = document.querySelector("#undoButton");
const redoButton = document.querySelector("#redoButton");
const resetButton = document.querySelector("#resetButton");

let undoStack = [];
let redoStack = [];
let historyAction = false;


/* =========================================================
   RECORD HISTORY
========================================================= */

function recordHistory(undo, redo) {

    if (historyAction) return;

    undoStack.push({
        undo: undo,
        redo: redo
    });

    redoStack = [];
}


/* =========================================================
   UNDO
========================================================= */

if (undoButton) {

    undoButton.addEventListener("click", (event) => {

        event.stopPropagation();

        if (undoStack.length === 0) {
            return;
        }

        const action = undoStack.pop();

        historyAction = true;

        action.undo();

        historyAction = false;

        redoStack.push(action);

        console.log("Undo.");
    });
}


/* =========================================================
   REDO
========================================================= */

if (redoButton) {

    redoButton.addEventListener("click", (event) => {

        event.stopPropagation();

        if (redoStack.length === 0) {
            return;
        }

        const action = redoStack.pop();

        historyAction = true;

        action.redo();

        historyAction = false;

        undoStack.push(action);

        console.log("Redo.");
    });
}









/* =========================================================
   RESET LAB
========================================================= */

if (resetButton) {

    resetButton.addEventListener("click", (event) => {

        event.stopPropagation();


        /* Remove all installed cables */

        document
            .querySelectorAll(".installed-cable")
            .forEach((cable) => {

                cable.remove();

            });


        /* Reset cable selection */

        selectedCable = null;

        selectedCableType = null;

        firstKnockout = null;


        /* Remove knockout selections */

        document
            .querySelectorAll(".knockout")
            .forEach((knockout) => {

                knockout.classList.remove(
                    "knockout-selected",
                    "connection-hint",
                    "cable-14-2",
                    "cable-14-3"
                );

                knockout.dataset.cable = "";

            });


        /* Reset switch */

        switchOn = false;

        if (switchToggle) {

            switchToggle.classList.remove(
                "switch-on"
            );

        }


        /* Clear history */

        undoStack = [];

        redoStack = [];


        /* Close cable menu */

        if (cableMenu) {

            cableMenu.style.display = "none";

        }


        console.log("Lab reset.");

    });

}







/* =====================================================
   CABLE CONNECTION STATE
===================================================== */
    let firstKnockout = null;
    let selectedCableType = null;
    let selectedCable = null;


/* =====================================================
   CREATE CABLE
===================================================== */
    function createCable(knockout1, knockout2, cableType) {

        const cableLayer =
            document.querySelector("#cableLayer");

        const workArea =
            document.querySelector(".work-area");









        if (!cableLayer || !workArea) return;

        const workAreaRect =
            workArea.getBoundingClientRect();

        const rect1 =
            knockout1.getBoundingClientRect();

        const rect2 =
            knockout2.getBoundingClientRect();


        /* Center points of both knockouts */
        const x1 =
            rect1.left + rect1.width / 2 -
            workAreaRect.left;

        const y1 =
            rect1.top + rect1.height / 2 -
            workAreaRect.top;

        const x2 =
            rect2.left + rect2.width / 2 -
            workAreaRect.left;

        const y2 =
            rect2.top + rect2.height / 2 -
            workAreaRect.top;


        /* Cable length */
        const dx = x2 - x1;
        const dy = y2 - y1;

        const length =
            Math.sqrt(dx * dx + dy * dy);


        /* Cable angle */
        const angle =
            Math.atan2(dy, dx) *
            (180 / Math.PI);


        /* Create cable */

const cable =
    document.createElement("div");

cable.classList.add(
    "installed-cable",
    cableType
);

/* Store connected knockouts */
cable.knockout1 = knockout1;
cable.knockout2 = knockout2;







        /* Position and rotate cable */
        cable.style.left = `${x1}px`;
        cable.style.top = `${y1}px`;
        cable.style.width = `${length}px`;
        cable.style.transform =
            `rotate(${angle}deg)`;


        /* Add cable to cable layer */
cableLayer.appendChild(cable);


/* Add cable printing */
updateCablePrinting(cable);












 /* Make cable selectable */

cable.addEventListener("click", (event) => {

    event.stopPropagation();

    /* Remove selection from other cables */

    document
        .querySelectorAll(".installed-cable")
        .forEach((item) => {

            item.classList.remove("cable-selected");

        });


    /* Select this cable */

    cable.classList.add("cable-selected");

    selectedCable = cable;


    /* Get cable position */

    const cableRect =
        cable.getBoundingClientRect();

    const workAreaRect =
        workArea.getBoundingClientRect();


    /* Position cable menu */

    cableMenu.style.left =
        `${cableRect.left -
        workAreaRect.left + 20}px`;

    cableMenu.style.top =
        `${cableRect.top -
        workAreaRect.top + 20}px`;


    /* Show cable menu */

    /* Show Remove Cable for existing cable */
        if (cableRemove) {
    cableRemove.style.display = "block";
        }

    cableMenu.style.display = "block";


    console.log("Cable selected.");

});



















  console.log(
    `Created ${cableType} cable.`
);

return cable;

}
/* =====================================================
   UPDATE CABLE POSITION
===================================================== */

function updateCablePosition(cable) {

    const knockout1 = cable.knockout1;
    const knockout2 = cable.knockout2;

    const workArea =
        document.querySelector(".work-area");

    if (!knockout1 || !knockout2 || !workArea) {
        return;
    }

    const workAreaRect =
        workArea.getBoundingClientRect();

    const rect1 =
        knockout1.getBoundingClientRect();

    const rect2 =
        knockout2.getBoundingClientRect();


    /* Get knockout center points */

    const x1 =
        rect1.left +
        rect1.width / 2 -
        workAreaRect.left;

    const y1 =
        rect1.top +
        rect1.height / 2 -
        workAreaRect.top;

    const x2 =
        rect2.left +
        rect2.width / 2 -
        workAreaRect.left;

    const y2 =
        rect2.top +
        rect2.height / 2 -
        workAreaRect.top;


    /* Calculate cable length */

    const dx = x2 - x1;
    const dy = y2 - y1;

    const length =
        Math.sqrt(dx * dx + dy * dy);


    /* Calculate cable angle */

    const angle =
        Math.atan2(dy, dx) *
        (180 / Math.PI);


    /* Update cable position */

    cable.style.left =
        `${x1}px`;

    cable.style.top =
        `${y1}px`;

    cable.style.width =
        `${length}px`;

    cable.style.transform =
        `rotate(${angle}deg)`;


    /* Update cable printing */

    updateCablePrinting(cable);

}





/* =====================================================
   UPDATE CABLE PRINTING
===================================================== */

function updateCablePrinting(cable) {

    const length =
        parseFloat(cable.style.width) || 0;


    let cableName = "";
    let spacing = 70;


    if (
        cable.classList.contains("14-2-nmb")
    ) {

        cableName = "14/2";

    }


    else if (
        cable.classList.contains("14-3-nmb")
    ) {

        cableName = "14/3";

    }


    else if (
        cable.classList.contains("12-2-nmb")
    ) {

        cableName = "12/2";

    }


    else if (
        cable.classList.contains("12-3-nmb")
    ) {

        cableName = "12/3";

    }


    else if (
        cable.classList.contains("10-2-nmb")
    ) {

        cableName = "10/2";

    }


    else if (
        cable.classList.contains("10-3-nmb")
    ) {

        cableName = "10/3";

    }


    /* Calculate how many labels */

    const count =
        Math.max(
            2,
            Math.ceil(length / spacing)
        );


    /* Create repeating label */

    const label =
        Array(count)
            .fill(cableName)
            .join("    ");


    /* Send label to CSS */

    cable.style.setProperty(
        "--cable-label",
        `"${label}"`
    );

}









/* =====================================================
   SINGLE-POLE SWITCH
===================================================== */
    const switchToggle =
        document.querySelector(".switch-toggle");

    let switchOn = false;


/* =====================================================
   SWITCH CLICK
===================================================== */
    if (switchToggle) {

    switchToggle.addEventListener("click", () => {

        /* Save the switch state before changing it */
        const previousState = switchOn;

        /* Toggle switch state */
        switchOn = !switchOn;

        /* Move the switch toggle */
        switchToggle.classList.toggle(
            "switch-on",
            switchOn
        );

        /* Record switch action */
        recordHistory(

            /* UNDO */
            () => {

                switchOn = previousState;

                switchToggle.classList.toggle(
                    "switch-on",
                    switchOn
                );

            },

            /* REDO */
            () => {

                switchOn = !previousState;

                switchToggle.classList.toggle(
                    "switch-on",
                    switchOn
                );

            }

        );

    });

}


/* =====================================================
   KNOCKOUT SELECTION
===================================================== */
    const knockouts =
        document.querySelectorAll(".knockout");

    const cableMenu =
        document.querySelector("#cableMenu");

        const cableRemove =
    document.querySelector(".cable-remove");


    knockouts.forEach((knockout) => {

        knockout.addEventListener("click", () => {


            /* Remove selection from all knockouts */

            knockouts.forEach((item) => {

                item.classList.remove(
                    "knockout-selected"
                );

            });


/* =================================================
   SECOND KNOCKOUT — CREATE CABLE
================================================= */

            /* Temporary Code - starts here */

            console.log("Connection check:", {
                firstKnockout: firstKnockout,
                selectedCableType: selectedCableType,
                clickedKnockout: knockout
            });

            /* Temporary Code - ends here */


            if (
                firstKnockout &&
                firstKnockout !== knockout &&
                selectedCableType &&
                selectedCableType !== "remove"
            ) {














const newCable = createCable(
    firstKnockout,
    knockout,
    selectedCableType
);

console.log("Cable created.");


/* =================================================
   RECORD CABLE CREATION
================================================= */

recordHistory(

    /* UNDO */
    () => {

        if (newCable) {
            newCable.remove();
        }

    },

    /* REDO */
() => {

    if (newCable) {

        const cableLayer =
            document.querySelector("#cableLayer");

        if (cableLayer) {

            cableLayer.appendChild(newCable);

            updateCablePosition(newCable);

        }

    }

}

);

                firstKnockout = null;
                selectedCableType = null;


            
/* Remove connection hints */
knockouts.forEach((item) => {

    item.classList.remove(
        "connection-hint"
    );

});


                if (cableMenu) {
                    cableMenu.style.display = "none";
                }

                knockouts.forEach((item) => {

                    item.classList.remove(
                        "knockout-selected"
                    );

                });

                return;

            }


            /* Select clicked knockout */
            knockout.classList.add(
                "knockout-selected"
            );


            /* Store first knockout */
            if (!firstKnockout) {

                firstKnockout = knockout;

            }


            /* Get knockout position */
            const knockoutRect =
                knockout.getBoundingClientRect();

            const workArea =
                knockout.closest(".work-area");














            if (!workArea || !cableMenu) return;


            const workAreaRect =
                workArea.getBoundingClientRect();


/* =================================================
   GET CABLE MENU SIZE
================================================= */

cableMenu.style.visibility = "hidden";
cableMenu.style.display = "block";

const menuWidth = cableMenu.offsetWidth;
const menuHeight = cableMenu.offsetHeight;








let menuLeft =
    knockoutRect.right -
    workAreaRect.left + 10;

let menuTop =
    knockoutRect.top -
    workAreaRect.top + 20;


/* Keep menu inside right edge */

if (
    menuLeft + menuWidth >
    workAreaRect.width
) {

    menuLeft =
        knockoutRect.left -
        workAreaRect.left -
        menuWidth -
        10;

}


/* Keep menu inside left edge */

if (menuLeft < 0) {

    menuLeft = 10;

}


/* Keep menu inside bottom edge */

if (
    menuTop + menuHeight >
    workAreaRect.height
) {

    menuTop =
        knockoutRect.bottom -
        workAreaRect.top -
        menuHeight -
        10;

}


/* Keep menu inside top edge */

if (menuTop < 0) {

    menuTop = 10;

}


/* Apply final position */

cableMenu.style.left =
    `${menuLeft}px`;

cableMenu.style.top =
    `${menuTop}px`;
    cableMenu.style.visibility = "visible";

















                

            /* Hide Remove Cable for new connection */
            if (cableRemove) {
                cableRemove.style.display = "none";
            }


            /* Show cable menu */
            cableMenu.style.display = "block";

        });

    });














/* =====================================================
   MOVABLE JUNCTION BOXES
===================================================== */

const electricalBoxes =
    document.querySelectorAll(".electrical-box");

electricalBoxes.forEach((box) => {

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    box.addEventListener("mousedown", (event) => {

        /* Do not drag when clicking a knockout */
        if (event.target.closest(".knockout")) {
            return;
        }

        dragging = true;

        const boxRect =
            box.getBoundingClientRect();

        startX = event.clientX;
        startY = event.clientY;

        startLeft =
            box.offsetLeft;

        startTop =
            box.offsetTop;

        box.style.zIndex = "10";

        event.preventDefault();

    });


    document.addEventListener("mousemove", (event) => {

    if (!dragging) {
        return;
    }

    const dx =
        event.clientX - startX;

    const dy =
        event.clientY - startY;


    box.style.left =
        `${startLeft + dx}px`;

    box.style.top =
        `${startTop + dy}px`;


    /* Update cables connected to this box */

    document
        .querySelectorAll(".installed-cable")
        .forEach((cable) => {

            if (
                cable.knockout1 &&
                cable.knockout1.closest(".electrical-box") === box
            ) {

                updateCablePosition(cable);

            }

            else if (
                cable.knockout2 &&
                cable.knockout2.closest(".electrical-box") === box
            ) {

                updateCablePosition(cable);

            }

        });

});


    document.addEventListener("mouseup", () => {

        if (!dragging) {
            return;
        }

        dragging = false;

    });

});



















/* =====================================================
   CLICK WORK AREA TO CLOSE CABLE MENU
===================================================== */
    const workArea =
        document.querySelector(".work-area");

    if (workArea) {

        workArea.addEventListener("click", (event) => {

            /* Do not close menu when clicking a knockout */
            if (event.target.closest(".knockout")) {
                return;
            }


            /* Close cable menu */
            if (cableMenu) {
                cableMenu.style.display = "none";
            }
            /* Clear selected cable */
if (selectedCable) {
    selectedCable.classList.remove("cable-selected");
    selectedCable = null;
}


            /* Remove knockout highlight */
            knockouts.forEach((item) => {

                item.classList.remove(
                    "knockout-selected"
                );

            });

        });

    }


/* =====================================================
   CABLE OPTION CLICK
===================================================== */
    const cableOptions =
        document.querySelectorAll(".cable-option");


    cableOptions.forEach((option) => {

        option.addEventListener("click", () => {

            const cableType =
                option.dataset.cable;


            /* =================================================
               EXISTING CABLE SELECTED
            ================================================= */

            if (selectedCable) {


                /* REMOVE CABLE */

                if (cableType === "remove") {

    const cableToRemove = selectedCable;
    const cableParent = cableToRemove.parentNode;
    const cableNextSibling = cableToRemove.nextSibling;

    cableToRemove.remove();

    selectedCable = null;

    cableMenu.style.display = "none";


    /* =================================================
       RECORD CABLE REMOVAL
    ================================================= */

    recordHistory(

        /* UNDO */
        () => {

            cableParent.insertBefore(
                cableToRemove,
                cableNextSibling
            );

        },

        /* REDO */
        () => {

            cableToRemove.remove();

        }

    );


    console.log("Cable removed.");

    return;
}


                /* CHANGE TO 14-2 NMB */

if (cableType === "14-2-nmb") {

    selectedCable.classList.remove(
        "14-3-nmb",
        "12-2-nmb",
        "12-3-nmb",
        "10-2-nmb",
        "10-3-nmb"
    );

    selectedCable.classList.add(
        "14-2-nmb"
    );

    updateCablePrinting(selectedCable);

    console.log(
        "Cable changed to 14-2 NMB."
    );

}


/* CHANGE TO 14-3 NMB */

else if (cableType === "14-3-nmb") {

    selectedCable.classList.remove(
        "14-2-nmb",
        "12-2-nmb",
        "12-3-nmb",
        "10-2-nmb",
        "10-3-nmb"
    );

    selectedCable.classList.add(
        "14-3-nmb"
    );

    updateCablePrinting(selectedCable);

    console.log(
        "Cable changed to 14-3 NMB."
    );

}


                /* Close menu */

                cableMenu.style.display = "none";


                /* Remove cable selection */

                selectedCable.classList.remove(
                    "cable-selected"
                );


                selectedCable = null;

                return;

            }


            /* =================================================
               NEW CABLE CONNECTION
            ================================================= */

            selectedCableType = cableType;




/* =================================================
   HINT — SELECT ANOTHER KNOCKOUT
================================================= */

if (
    cableType === "14-2-nmb" ||
    cableType === "14-3-nmb" ||
    cableType === "12-2-nmb" ||
    cableType === "12-3-nmb" ||
    cableType === "10-2-nmb" ||
    cableType === "10-3-nmb"
) {

    knockouts.forEach((item) => {

        if (item !== firstKnockout) {

            item.classList.add(
                "connection-hint"
            );

        }

    });

}







            
            /* Get currently selected knockout */

            const selectedKnockout =
                document.querySelector(
                    ".knockout-selected"
                );


            /* Safety check */

            if (!selectedKnockout) {

                console.log(
                    "No knockout selected."
                );

                return;

            }


            /* Remove cable */

            if (cableType === "remove") {

                selectedKnockout.dataset.cable = "";

                selectedKnockout.classList.remove(
                    "cable-14-2",
                    "cable-14-3"
                );

                console.log(
                    "Cable removed from knockout."
                );

            }


            /* 14-2 NMB */

            else if (cableType === "14-2-nmb") {

                selectedKnockout.dataset.cable =
                    "14-2-nmb";

                selectedKnockout.classList.remove(
                    "cable-14-3"
                );

                selectedKnockout.classList.add(
                    "cable-14-2"
                );

                console.log(
                    "14-2 NMB selected."
                );

            }


            /* 14-3 NMB */

            else if (cableType === "14-3-nmb") {

                selectedKnockout.dataset.cable =
                    "14-3-nmb";

                selectedKnockout.classList.remove(
                    "cable-14-2"
                );

                selectedKnockout.classList.add(
                    "cable-14-3"
                );

                console.log(
                    "14-3 NMB selected."
                );

            }


            /* Close menu */

            cableMenu.style.display = "none";


            /* Remove knockout highlight */

            selectedKnockout.classList.remove(
                "knockout-selected"
            );

        });





        
    });









    

});


/* =========================================================
   document.addEventListener
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

    console.log("GFCI Test Lab loaded.");



/* =========================================================
   UNDO / REDO
========================================================= */

const undoButton = document.querySelector("#undoButton");
const redoButton = document.querySelector("#redoButton");
const resetButton = document.querySelector("#resetButton");

let undoStack = [];
let redoStack = [];
let historyAction = false;


/* =========================================================
   RECORD HISTORY
========================================================= */

function recordHistory(undo, redo) {

    if (historyAction) return;

    undoStack.push({
        undo: undo,
        redo: redo
    });

    redoStack = [];
}


/* =========================================================
   UNDO
========================================================= */

if (undoButton) {

    undoButton.addEventListener("click", (event) => {

        event.stopPropagation();

        if (undoStack.length === 0) {
            return;
        }

        const action = undoStack.pop();

        historyAction = true;

        action.undo();

        historyAction = false;

        redoStack.push(action);

        console.log("Undo.");
    });
}


/* =========================================================
   REDO
========================================================= */

if (redoButton) {

    redoButton.addEventListener("click", (event) => {

        event.stopPropagation();

        if (redoStack.length === 0) {
            return;
        }

        const action = redoStack.pop();

        historyAction = true;

        action.redo();

        historyAction = false;

        undoStack.push(action);

        console.log("Redo.");
    });
}









/* =========================================================
   RESET LAB
========================================================= */

if (resetButton) {

    resetButton.addEventListener("click", (event) => {

        event.stopPropagation();


        /* Remove all installed cables */

        document
            .querySelectorAll(".installed-cable")
            .forEach((cable) => {

                cable.remove();

            });


        /* Reset cable selection */

        selectedCable = null;

        selectedCableType = null;

        firstKnockout = null;


        /* Remove knockout selections */

        document
            .querySelectorAll(".knockout")
            .forEach((knockout) => {

                knockout.classList.remove(
                    "knockout-selected",
                    "connection-hint",
                    "cable-14-2",
                    "cable-14-3"
                );

                knockout.dataset.cable = "";

            });


        /* Reset switch */

        switchOn = false;

        if (switchToggle) {

            switchToggle.classList.remove(
                "switch-on"
            );

        }


        /* Clear history */

        undoStack = [];

        redoStack = [];


        /* Close cable menu */

        if (cableMenu) {

            cableMenu.style.display = "none";

        }


        console.log("Lab reset.");

    });

}







/* =====================================================
   CABLE CONNECTION STATE
===================================================== */
    let firstKnockout = null;
    let selectedCableType = null;
    let selectedCable = null;


/* =====================================================
   CREATE CABLE
===================================================== */
    function createCable(knockout1, knockout2, cableType) {

        const cableLayer =
            document.querySelector("#cableLayer");

        const workArea =
            document.querySelector(".work-area");









        if (!cableLayer || !workArea) return;

        const workAreaRect =
            workArea.getBoundingClientRect();

        const rect1 =
            knockout1.getBoundingClientRect();

        const rect2 =
            knockout2.getBoundingClientRect();


        /* Center points of both knockouts */
        const x1 =
            rect1.left + rect1.width / 2 -
            workAreaRect.left;

        const y1 =
            rect1.top + rect1.height / 2 -
            workAreaRect.top;

        const x2 =
            rect2.left + rect2.width / 2 -
            workAreaRect.left;

        const y2 =
            rect2.top + rect2.height / 2 -
            workAreaRect.top;


        /* Cable length */
        const dx = x2 - x1;
        const dy = y2 - y1;

        const length =
            Math.sqrt(dx * dx + dy * dy);


        /* Cable angle */
        const angle =
            Math.atan2(dy, dx) *
            (180 / Math.PI);


        /* Create cable */

const cable =
    document.createElement("div");

cable.classList.add(
    "installed-cable",
    cableType
);

/* Store connected knockouts */
cable.knockout1 = knockout1;
cable.knockout2 = knockout2;







        /* Position and rotate cable */
        cable.style.left = `${x1}px`;
        cable.style.top = `${y1}px`;
        cable.style.width = `${length}px`;
        cable.style.transform =
            `rotate(${angle}deg)`;


        /* Add cable to cable layer */
        cableLayer.appendChild(cable);













 /* Make cable selectable */

cable.addEventListener("click", (event) => {

    event.stopPropagation();

    /* Remove selection from other cables */

    document
        .querySelectorAll(".installed-cable")
        .forEach((item) => {

            item.classList.remove("cable-selected");

        });


    /* Select this cable */

    cable.classList.add("cable-selected");

    selectedCable = cable;


    /* Get cable position */

    const cableRect =
        cable.getBoundingClientRect();

    const workAreaRect =
        workArea.getBoundingClientRect();


    /* Position cable menu */

    cableMenu.style.left =
        `${cableRect.left -
        workAreaRect.left + 20}px`;

    cableMenu.style.top =
        `${cableRect.top -
        workAreaRect.top + 20}px`;


    /* Show cable menu */

    /* Show Remove Cable for existing cable */
        if (cableRemove) {
    cableRemove.style.display = "block";
        }

    cableMenu.style.display = "block";


    console.log("Cable selected.");

});



















  console.log(
    `Created ${cableType} cable.`
);

return cable;

}
/* =====================================================
   UPDATE CABLE POSITION
===================================================== */

function updateCablePosition(cable) {

    const knockout1 = cable.knockout1;
    const knockout2 = cable.knockout2;

    const workArea =
        document.querySelector(".work-area");

    if (!knockout1 || !knockout2 || !workArea) {
        return;
    }

    const workAreaRect =
        workArea.getBoundingClientRect();

    const rect1 =
        knockout1.getBoundingClientRect();

    const rect2 =
        knockout2.getBoundingClientRect();


    /* Get knockout center points */

    const x1 =
        rect1.left +
        rect1.width / 2 -
        workAreaRect.left;

    const y1 =
        rect1.top +
        rect1.height / 2 -
        workAreaRect.top;

    const x2 =
        rect2.left +
        rect2.width / 2 -
        workAreaRect.left;

    const y2 =
        rect2.top +
        rect2.height / 2 -
        workAreaRect.top;


    /* Calculate cable length */

    const dx = x2 - x1;
    const dy = y2 - y1;

    const length =
        Math.sqrt(dx * dx + dy * dy);


    /* Calculate cable angle */

    const angle =
        Math.atan2(dy, dx) *
        (180 / Math.PI);


    /* Update cable */

    cable.style.left =
        `${x1}px`;

    cable.style.top =
        `${y1}px`;

    cable.style.width =
        `${length}px`;

    cable.style.transform =
        `rotate(${angle}deg)`;

}


/* =====================================================
   SINGLE-POLE SWITCH
===================================================== */
    const switchToggle =
        document.querySelector(".switch-toggle");

    let switchOn = false;


/* =====================================================
   SWITCH CLICK
===================================================== */
    if (switchToggle) {

    switchToggle.addEventListener("click", () => {

        /* Save the switch state before changing it */
        const previousState = switchOn;

        /* Toggle switch state */
        switchOn = !switchOn;

        /* Move the switch toggle */
        switchToggle.classList.toggle(
            "switch-on",
            switchOn
        );

        /* Record switch action */
        recordHistory(

            /* UNDO */
            () => {

                switchOn = previousState;

                switchToggle.classList.toggle(
                    "switch-on",
                    switchOn
                );

            },

            /* REDO */
            () => {

                switchOn = !previousState;

                switchToggle.classList.toggle(
                    "switch-on",
                    switchOn
                );

            }

        );

    });

}


/* =====================================================
   KNOCKOUT SELECTION
===================================================== */
    const knockouts =
        document.querySelectorAll(".knockout");

    const cableMenu =
        document.querySelector("#cableMenu");

        const cableRemove =
    document.querySelector(".cable-remove");


    knockouts.forEach((knockout) => {

        knockout.addEventListener("click", () => {


            /* Remove selection from all knockouts */

            knockouts.forEach((item) => {

                item.classList.remove(
                    "knockout-selected"
                );

            });


/* =================================================
   SECOND KNOCKOUT — CREATE CABLE
================================================= */

            /* Temporary Code - starts here */

            console.log("Connection check:", {
                firstKnockout: firstKnockout,
                selectedCableType: selectedCableType,
                clickedKnockout: knockout
            });

            /* Temporary Code - ends here */


            if (
                firstKnockout &&
                firstKnockout !== knockout &&
                selectedCableType &&
                selectedCableType !== "remove"
            ) {














const newCable = createCable(
    firstKnockout,
    knockout,
    selectedCableType
);

console.log("Cable created.");


/* =================================================
   RECORD CABLE CREATION
================================================= */

recordHistory(

    /* UNDO */
    () => {

        if (newCable) {
            newCable.remove();
        }

    },

    /* REDO */
    () => {

        if (newCable) {
            cableLayer.appendChild(newCable);
        }

    }

);

                firstKnockout = null;
                selectedCableType = null;


            
/* Remove connection hints */
knockouts.forEach((item) => {

    item.classList.remove(
        "connection-hint"
    );

});


                if (cableMenu) {
                    cableMenu.style.display = "none";
                }

                knockouts.forEach((item) => {

                    item.classList.remove(
                        "knockout-selected"
                    );

                });

                return;

            }


            /* Select clicked knockout */
            knockout.classList.add(
                "knockout-selected"
            );


            /* Store first knockout */
            if (!firstKnockout) {

                firstKnockout = knockout;

            }


            /* Get knockout position */
            const knockoutRect =
                knockout.getBoundingClientRect();

            const workArea =
                knockout.closest(".work-area");














            if (!workArea || !cableMenu) return;


            const workAreaRect =
                workArea.getBoundingClientRect();


            /* Position menu next to knockout */
            cableMenu.style.left =
                `${knockoutRect.right -
                workAreaRect.left + 10}px`;

            cableMenu.style.top =
                `${knockoutRect.top -
                workAreaRect.top + 20}px`;


            /* Hide Remove Cable for new connection */
            if (cableRemove) {
                cableRemove.style.display = "none";
            }


            /* Show cable menu */
            cableMenu.style.display = "block";

        });

    });














/* =====================================================
   MOVABLE JUNCTION BOXES
===================================================== */

const electricalBoxes =
    document.querySelectorAll(".electrical-box");

electricalBoxes.forEach((box) => {

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    box.addEventListener("mousedown", (event) => {

        /* Do not drag when clicking a knockout */
        if (event.target.closest(".knockout")) {
            return;
        }

        dragging = true;

        const boxRect =
            box.getBoundingClientRect();

        startX = event.clientX;
        startY = event.clientY;

        startLeft =
            box.offsetLeft;

        startTop =
            box.offsetTop;

        box.style.zIndex = "10";

        event.preventDefault();

    });


    document.addEventListener("mousemove", (event) => {

    if (!dragging) {
        return;
    }

    const dx =
        event.clientX - startX;

    const dy =
        event.clientY - startY;


    box.style.left =
        `${startLeft + dx}px`;

    box.style.top =
        `${startTop + dy}px`;


    /* Update cables connected to this box */

    document
        .querySelectorAll(".installed-cable")
        .forEach((cable) => {

            if (
                cable.knockout1 &&
                cable.knockout1.closest(".electrical-box") === box
            ) {

                updateCablePosition(cable);

            }

            else if (
                cable.knockout2 &&
                cable.knockout2.closest(".electrical-box") === box
            ) {

                updateCablePosition(cable);

            }

        });

});


    document.addEventListener("mouseup", () => {

        if (!dragging) {
            return;
        }

        dragging = false;

    });

});



















/* =====================================================
   CLICK WORK AREA TO CLOSE CABLE MENU
===================================================== */
    const workArea =
        document.querySelector(".work-area");

    if (workArea) {

        workArea.addEventListener("click", (event) => {

            /* Do not close menu when clicking a knockout */
            if (event.target.closest(".knockout")) {
                return;
            }


            /* Close cable menu */
            if (cableMenu) {
                cableMenu.style.display = "none";
            }
            /* Clear selected cable */
if (selectedCable) {
    selectedCable.classList.remove("cable-selected");
    selectedCable = null;
}


            /* Remove knockout highlight */
            knockouts.forEach((item) => {

                item.classList.remove(
                    "knockout-selected"
                );

            });

        });

    }


/* =====================================================
   CABLE OPTION CLICK
===================================================== */
    const cableOptions =
        document.querySelectorAll(".cable-option");


    cableOptions.forEach((option) => {

        option.addEventListener("click", () => {

            const cableType =
                option.dataset.cable;


            /* =================================================
               EXISTING CABLE SELECTED
            ================================================= */

            if (selectedCable) {


                /* REMOVE CABLE */

                if (cableType === "remove") {

    const cableToRemove = selectedCable;
    const cableParent = cableToRemove.parentNode;
    const cableNextSibling = cableToRemove.nextSibling;

    cableToRemove.remove();

    selectedCable = null;

    cableMenu.style.display = "none";


    /* =================================================
       RECORD CABLE REMOVAL
    ================================================= */

    recordHistory(

        /* UNDO */
        () => {

            cableParent.insertBefore(
                cableToRemove,
                cableNextSibling
            );

        },

        /* REDO */
        () => {

            cableToRemove.remove();

        }

    );


    console.log("Cable removed.");

    return;
}


                /* CHANGE TO 14-2 */

                if (cableType === "14-2-nmb") {

                    selectedCable.classList.remove(
                        "cable-14-3"
                    );

                    selectedCable.classList.add(
                        "cable-14-2"
                    );

                    console.log(
                        "Cable changed to 14-2 NMB."
                    );

                }


                /* CHANGE TO 14-3 */

                else if (cableType === "14-3-nmb") {

                    selectedCable.classList.remove(
                        "cable-14-2"
                    );

                    selectedCable.classList.add(
                        "cable-14-3"
                    );

                    console.log(
                        "Cable changed to 14-3 NMB."
                    );

                }


                /* Close menu */

                cableMenu.style.display = "none";


                /* Remove cable selection */

                selectedCable.classList.remove(
                    "cable-selected"
                );


                selectedCable = null;

                return;

            }


            /* =================================================
               NEW CABLE CONNECTION
            ================================================= */

            selectedCableType = cableType;




/* =================================================
   HINT — SELECT ANOTHER KNOCKOUT
================================================= */

if (
    cableType === "14-2-nmb" ||
    cableType === "14-3-nmb" ||
    cableType === "12-2-nmb" ||
    cableType === "12-3-nmb" ||
    cableType === "10-2-nmb" ||
    cableType === "10-3-nmb"
) {

    knockouts.forEach((item) => {

        if (item !== firstKnockout) {

            item.classList.add(
                "connection-hint"
            );

        }

    });

}







            
            /* Get currently selected knockout */

            const selectedKnockout =
                document.querySelector(
                    ".knockout-selected"
                );


            /* Safety check */

            if (!selectedKnockout) {

                console.log(
                    "No knockout selected."
                );

                return;

            }


            /* Remove cable */

            if (cableType === "remove") {

                selectedKnockout.dataset.cable = "";

                selectedKnockout.classList.remove(
                    "cable-14-2",
                    "cable-14-3"
                );

                console.log(
                    "Cable removed from knockout."
                );

            }


            /* 14-2 NMB */

            else if (cableType === "14-2-nmb") {

                selectedKnockout.dataset.cable =
                    "14-2-nmb";

                selectedKnockout.classList.remove(
                    "cable-14-3"
                );

                selectedKnockout.classList.add(
                    "cable-14-2"
                );

                console.log(
                    "14-2 NMB selected."
                );

            }


            /* 14-3 NMB */

            else if (cableType === "14-3-nmb") {

                selectedKnockout.dataset.cable =
                    "14-3-nmb";

                selectedKnockout.classList.remove(
                    "cable-14-2"
                );

                selectedKnockout.classList.add(
                    "cable-14-3"
                );

                console.log(
                    "14-3 NMB selected."
                );

            }


            /* Close menu */

            cableMenu.style.display = "none";


            /* Remove knockout highlight */

            selectedKnockout.classList.remove(
                "knockout-selected"
            );

        });





        
    });









    

});


