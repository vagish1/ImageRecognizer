const URL = "./models/";

let model, webcam, labelContainer, maxPredictions;

let disableCamClick = false;

const colors = [
    "#E4B4C2",
    "#E75A7C",
    "#553555",
    "#2C0735",
    "#FF3366",
    "#FFFD98",
    "#6E44FF",
    "#FFBC42",
    "#006BA6"
];

// const open =
//     document.querySelector(".selectInfoBtn");
// open.addEventListener("click", () => {



// });


function onSourceChange(e) {
    if (e.target.value == "Webcam") {

    }
}

function start() {
    if (disableCamClick) {
        disableCamClick = false;

        const emptyContainer = document.createElement("div");
        const emptyTitle = document.createElement("h3");
        const emptyContent = document.createElement("p");
        emptyContainer.className = "emptyContainer";
        emptyTitle.innerText = "Your result will appear here"

        emptyContent.innerText = "You will see the different name's that matches the object present in the video/images, Click on button above to start recognizing different images.";
        emptyContainer.appendChild(emptyTitle);
        emptyContainer.appendChild(emptyContent);
        document.querySelector(".webCam").removeChild(webcam.canvas);
        document.querySelector(".classes").replaceChildren([

        ]);
        document.querySelector(".classes").appendChild(emptyContainer);


        webcam.stop();
        return;
    }
    init();
}


async function init() {
    if (disableCamClick) {
        return;
    }
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(500, 500, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();


    document.querySelector(".webCam").appendChild(webcam.canvas);
    disableCamClick = true;
    labelContainer = document.querySelector(".classes");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        const itemContainer = document.createElement("div");
        const itemTitle = document.createElement("h4");
        const predictionCount = document.createElement("p")
        itemContainer.style.backgroundColor = colors[Math.floor(Math.random() * 9)];
        itemContainer.className = "items";
        itemTitle.className = "className";
        itemTitle.innerText = "Class" + i;
        predictionCount.className = "predictionVal";
        itemContainer.appendChild(itemTitle);
        itemContainer.appendChild(predictionCount);

        labelContainer.appendChild(itemContainer);
    }

    window.requestAnimationFrame(loop);
}

async function predict() {
    // predict can take in an image, video or canvas html element

    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const nodes = labelContainer.childNodes



        try {

            const items = nodes[nodes.length == 2 ? i : i + 1];

            items.querySelector(".className").innerHTML = prediction[i].className;
            items.querySelector(".predictionVal").innerHTML = prediction[i].probability.toFixed(2) * 100 + "%";
        } catch (e) {

        }


    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();

    window.requestAnimationFrame(loop);
}

