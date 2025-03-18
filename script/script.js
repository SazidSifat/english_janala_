const nav = document.getElementById("nav")
const banner = document.getElementById("banner")
const lessonSection = document.getElementById("lessonSection")
const faq = document.getElementById("faq")
const loder = document.getElementById("loder")
let lCount = 1;


const showLoder = () => {
    loder.classList.remove("hidden")

}
const hideLoder = () => {
    loder.classList.add("hidden")

}


const checkLogin = () => {

    const userName = document.getElementById("username").value
    const loginCode = document.getElementById("loginCode").value
    const checkNumber = parseInt(loginCode)


    if (!userName) {
        alert("Enter UserName ")
    } else {
        if (!loginCode) {
            alert("Enter Password")
        } else {
            if (checkNumber === 123456) {

                displayHiddenItem()
            } else {
                alert("Invalid Login code")
            }
        }
    }
}

const displayHiddenItem = () => {
    nav.classList.remove("hidden");
    banner.classList.add("hidden");
    lessonSection.classList.remove("hidden");
    faq.classList.remove("hidden");
    alert("Login Successful")
    lessonButtonfetch()
}

const logout = () => {

    nav.classList.add("hidden");
    banner.classList.remove("hidden");
    lessonSection.classList.add("hidden");
    faq.classList.add("hidden");

}

const lessonButtonfetch = () => {

    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json()).then((data) => {
            setLessonButton(data.data)
        })
}

const setLessonButton = (datas) => {
    const lessonButtons = document.getElementById("lessonButtons");
    lessonButtons.innerHTML = ""


    datas.forEach(el => {

        const btn = document.createElement("button")
        btn.className = "lesson btn border border-[#422AD5] text-[#422AD5] hover:bg-[#422AD5] hover:text-white text-xs md:text-sm"
        btn.innerHTML = `<i class="fa-solid fa-book-open"></i> Lesson-${lCount}`;
        lessonButtons.appendChild(btn)
        lCount++

        btn.addEventListener("click", e => {
            clickedBtn(e.target)
            showLevels(el)


        })
    });
}
const clickedBtn = (item) => {
    const lessonBtns = document.querySelectorAll(".lesson")
    lessonBtns.forEach((lessonBtn) => {
        lessonBtn.classList.remove("active")
    })
    item.classList.add("active")
}

const showLevels = (data) => {
    showLoder();
    const API = `https://openapi.programming-hero.com/api/level/${data.level_no}`;

    fetch(API).then(res => res.json()).then(data => {

        showLevelElements(data.data)
    })

}

const showLevelElements = (datas) => {
   

    const levelElements = document.getElementById("levelElements");
    levelElements.innerHTML = "";

    if (datas.length == 0) {
        levelElements.innerHTML = `   <div class=" place-items-center  text-center py-16 w-full col-span-3 space-y-6">
                <img src="assets/alert-error.png" alt="">
                <p class="text-sm text-[#797168]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="font-medium text-4xl">নেক্সট Lesson এ যান</h1>
            </div>`
        hideLoder()
        return

    }

    datas.forEach(data => {

        const div = document.createElement("div")
        div.className = "bg-white py-14 px-12 rounded-xl cursor-pointer space-y-8";
        div.innerHTML = ` <div class="space-y-6 text-center">
                        <h1 class="text-3xl font-semibold word"> </h1>
                        <p class="text-xl">Meaning /Pronounciation</p>
                        <p class="text-3xl font-semibold"> <span id="meaning"></span>/<span id="pronunciation"></span> </p>
                    </div>
                    <div class="flex justify-between">
                        <div class="bg-[#1A91FF1A] rounded-lg">
                            <i class="fa-solid fa-circle-info text-2xl p-4"></i>
                        </div>
                        <div class="bg-[#1A91FF1A] rounded-lg sound">
                            <i class="fa-solid fa-volume-high text-2xl p-4"></i>
                        </div>
                    </div>`

        // word
        if (!data.word) {
            div.querySelector(".word").innerHTML = "No Word Found"
        } else {
            div.querySelector(".word").innerHTML = data.word
        }
        // meaning
        if (!data.meaning) {
            div.querySelector("#meaning").innerHTML = "No meaning Found"
        } else {
            div.querySelector("#meaning").innerHTML = data.meaning
        }
        // pronunciation
        if (!data.pronunciation) {
            div.querySelector("#pronunciation").innerText = "No pronunciation Found"
        } else {
            div.querySelector("#pronunciation").innerHTML = data.pronunciation
        }

        levelElements.appendChild(div)



        div.querySelector(".sound").addEventListener("click", e => {
            e.stopPropagation();
            pronounceWord(data.word);

        })

        div.addEventListener("click", event => {
            wordDetails(data.id)
        })
    })
    hideLoder()
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

const wordDetails = (id) => {

    const API = `https://openapi.programming-hero.com/api/word/${id}`

    fetch(API).then(res => res.json()).then(data => {
        openModal(data.data)
    })
}

const openModal = (data) => {

    const modal = document.getElementById("modal")
    modal.innerHTML = "";

    modal.classList.remove("hidden")
    modal.classList.add("flex")

    const div = document.createElement("div")

    div.className = "p-12 rounded-3xl bg-white flex w-[600px]"
    div.innerHTML = `<div class="space-y-8">
                <h1 class="fontHind text-4xl font-semibold">
                    <span id="word"></span> (<i class="fa-solid fa-microphone cursor-pointer"></i>:<span id="pronunciation"></span>)
                </h1>
                <div>
                    <h2 class="font-semibold">Meaning:</h2>
                    <p  id="meaning"  class="fontHind  text-xl font-semibold"> </p>
                </div>
                <div>
                    <h1 class="font-semibold">Example:</h1>
                    <p id="sentence" class="font-semibold"></p>
                </div>
                <div class="space-y-2">
                    <h1 class="fontHind font-semibold">সমার্থক শব্দ গুলো</h1>
                    <div id="synonymes" class="flex items-center gap-2 flex-wrap">

                    </div>
                </div>
                <div>
                    <button onclick="closeModal()"
                        class="btn border bg-[#422AD5] text-white hover:border-[#422AD5]  rounded-xl hover:text-[#422AD5] hover:bg-transparent">
                        Complete Learning
                    </button>
                </div>
            </div>
        
    `;

    div.querySelector(".fa-microphone").addEventListener("click", e => {
        e.stopPropagation();
        pronounceWord(data.word);

    })

    

    // word
    if (!data.word) {
        div.querySelector("#word").innerHTML = "No Word Found"
    } else {
        div.querySelector("#word").innerHTML = data.word
    }
    // meaning
    if (!data.meaning) {
        div.querySelector("#meaning").innerHTML = "No meaning Found"
    } else {
        div.querySelector("#meaning").innerHTML = data.meaning
    }
    // pronunciation
    if (!data.pronunciation) {
        div.querySelector("#pronunciation").innerText = "No pronunciation Found"
    } else {
        div.querySelector("#pronunciation").innerHTML = data.pronunciation
    }
    // sentence
    if (!data.pronunciation) {
        div.querySelector("#sentence").innerText = "No sentence Found"
    } else {
        div.querySelector("#sentence").innerHTML = data.sentence
    }



    modal.append(div)


    const synonymes = document.getElementById("synonymes");
    const sd = data.synonyms

    if (sd.length > 0) {
        for (const s of sd) {
            synonymes.innerHTML += `<button class="btn  md:text-sm  border-[#422AD5]">${s} </button>`
        }
    } else {
        synonymes.innerHTML = `<p class="text-xl font-semibold"> No synonyms found</p>`
    }

}


const closeModal = () => {
    const modal = document.getElementById("modal")
    modal.classList.add("hidden")


}












