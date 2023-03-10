// query selectors

let nextBtnsEl = document.querySelectorAll(".next-btn")
let backBtnsEl = document.querySelectorAll(".back-btn")
let plansEl = document.querySelectorAll(".plans > div")
let forms = document.querySelectorAll("form")
let switchInputEl = document.querySelector(".switch input")
let periodPlanMonthly = document.querySelector(".period-plan-monthly")
let periodPlanYearly = document.querySelector(".period-plan-yearly")
let addOnsEl = document.querySelectorAll(".step-3-section label input")
let twoMonthsFreeEl = document.querySelectorAll(".two-months-free")
let plansPrices = document.querySelectorAll(".plans .gray-text")
let addOnsPrices = document.querySelectorAll(".step-3-section label .purple-text")
let addOnsContainerEl = document.querySelector(".plan-add-ons-container")
let totalPriceEl = document.querySelector(".confirm-total .purple-text")
// form validation variables
let firstFormEl = document.querySelector(".step-1-section form")
let nameInputEl = document.querySelector("#name-input")
let emailInputEl = document.querySelector("#email-input")
let phoneNumberEl = document.querySelector("#phone-number-input")
// error msgs
let nameInputErrorEl = document.querySelector(".name-input-error-msg")
let emailInputErrorEl = document.querySelector(".email-input-error-msg")
let phoneNumberErrorEl = document.querySelector(".phone-number-input-error-msg")

// global variables
let selectedPlanClass = "arcade-plan"
let period = "monthly"
let addons = []

// event listeners

forms.forEach(form => {
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        if (form.parentElement.parentElement.classList.contains("step-3-section")) {
            addons = []
            addOnsEl.forEach(addon => {
                if (addon.checked) {
                    addons.push(addon.value)
                }
            })
            let generatedSummaryHtml = generateSummary(selectedPlanClass, period, addons)
            addOnsContainerEl.innerHTML = generatedSummaryHtml
        }
    })
})

nextBtnsEl.forEach(btn => {
    btn.addEventListener('click', (e)=> {
        if (!e.target.parentElement.parentElement.parentElement.parentElement.classList.contains("step-1-section")) {
            changeSelectedStep(e, "+")
        } else {
            validateForm() 
            if (nameInputEl.validity.valid && emailInputEl.validity.valid && phoneNumberEl.validity.valid) {
                changeSelectedStep(e, "+")
            }
        }
    })
    
})

backBtnsEl.forEach(btn => {
    btn.addEventListener('click', (e) => {
        changeSelectedStep(e, "-")
    })
})

plansEl.forEach(plan => {
    plan.addEventListener("click", (e) => {
        selectPlan(e)
    })
})

switchInputEl.addEventListener("click", (e) => {
    if (e.target.checked == true) {
        period = "yearly"
        periodPlanMonthly.classList = "period-plan-monthly gray-text-bold"
        periodPlanYearly.classList = "period-plan-yearly bold-blue-text"
    } else {
        period = "monthly"
        periodPlanMonthly.classList = "period-plan-monthly bold-blue-text"
        periodPlanYearly.classList = "period-plan-yearly gray-text-bold"
    }
    toggleTwoMonths()
    togglePrices(period)
})

// functions

function returnNumberOfStep(event) {
    let regex = /\d+/;
    let classOfStep = event.target.parentElement.parentElement.parentElement.parentElement.classList.value
    let numberOfStep = classOfStep.match(regex)[0]
    return numberOfStep
}

function increaseSelectedStepNumber(number) {
    if (number == 4) {
        return 4
    } else {
        return Number(number) + 1
    }
}

function decreaseSelectedStepNumber(number) {
    if (number == 1) {
        return 1
    } else {
        return Number(number) - 1
    }
}

function clearAllStepLinks() {
    let stepLinks = document.querySelectorAll(".step-link")
    stepLinks.forEach(step => {
        step.classList.remove("selected-step")
    })
}

function clearAllStepLinksMobile() {
    let stepLinksMobile = document.querySelectorAll(".step-link-mobile") 
    stepLinksMobile.forEach(step => {
        step.classList.remove("selected-step")
    })
}

function clearAllStepSectionsActiveStatus() {
    let stepSections = document.querySelectorAll(".step-section")
    stepSections.forEach(stepSection => {
        stepSection.classList.remove("active")
    })
}

function changeSelectedStep(event, action) {
    let newNumber = increaseSelectedStepNumber(returnNumberOfStep(event))
    if (action == "-") {
        newNumber = decreaseSelectedStepNumber(returnNumberOfStep(event))
    }
    // query selectors
    let stepSectionEl = document.querySelector(`.step-${newNumber}-section`)
    if (event.target.classList.contains("confirm-btn")) {
        stepSectionEl = document.querySelector(".step-5-section")
    }
    let stepLinkEl = document.querySelectorAll(".step-link")[newNumber-1]
    let stepLinkMobileEl = document.querySelectorAll(".step-link-mobile")[newNumber-1]
    // making sure there is no active step links and step sections 
    clearAllStepLinks()
    clearAllStepSectionsActiveStatus()
    clearAllStepLinksMobile()
    // activating step link and step section
    stepSectionEl.classList.add("active")
    stepLinkEl.classList.add("selected-step")
    stepLinkMobileEl.classList.add("selected-step")
}

function clearAllPlans() {
    plansEl.forEach(plan => {
        plan.classList.remove("selected-plan")
    })
}

function selectPlan(event) {
    selectedPlanClass = `${event.target.classList[0]}`
    let selectedPlanEl = document.querySelector(`.${selectedPlanClass}`)
    clearAllPlans()
    selectedPlanEl.classList.add("selected-plan")
}

function toggleTwoMonths() {
    twoMonthsFreeEl.forEach(el => {
        el.classList.toggle("visible")
    })
}

function togglePrices(p) {
    if (p == "yearly") {
        plansPrices[0].innerHTML = "$90/yr"
        plansPrices[1].innerHTML = "$120/yr"
        plansPrices[2].innerHTML = "$150/yr"
        addOnsPrices[0].innerHTML = "+$10/yr"
        addOnsPrices[1].innerHTML = "+$20/yr"
        addOnsPrices[2].innerHTML = "+$20/yr"
    } else {
        plansPrices[0].innerHTML = "$9/mo"
        plansPrices[1].innerHTML = "$12/mo"
        plansPrices[2].innerHTML = "$15/mo"
        addOnsPrices[0].innerHTML = "+$1/mo"
        addOnsPrices[1].innerHTML = "+$2/mo"
        addOnsPrices[2].innerHTML = "+$2/mo"
    }
}

function generateSummary(selectedPlan, periodOfTime, addOns) {
    let plan = document.querySelectorAll(`.${selectedPlan} p`)
    let divAddOn = ``
    let totalPrice = Number(plan[1].innerHTML.match(/\d+/)[0])
    addOns.forEach(addon => {
        let addOnEl = document.querySelector(`.${addon}`)
        let nameOfAddOn = addOnEl.querySelector(".bold-blue-text").innerHTML
        let priceOfAddOn = addOnEl.querySelector(".purple-text").innerHTML
        totalPrice += Number(priceOfAddOn.match(/\d+/)[0])
        divAddOn += `
        <div>
            <p class="gray-text small">${nameOfAddOn}</p>
            <p class="bold-blue-text small">${priceOfAddOn}</p>
        </div>
        `
    })
    let newHtml = `
    <div class="confirm-plan">
    <div>
        <p class="bold-blue-text">${plan[0].innerHTML} (${periodOfTime})</p>
        <a class="gray-text small" href="#">Change</a>
    </div>
    <p class="bold-blue-text">${plan[1].innerHTML}</p>
    </div>
    <div class="confirm-add-ons">${divAddOn}</div>
    `
    totalPriceEl.innerHTML = `+$${totalPrice}/${plan[1].innerHTML.split("/")[1]}`
    return newHtml
}

// validation
function validateForm() {
    validateName()
    validateEmail()
    validateNumber()
}

function validateName() {
    if (nameInputEl.validity.valueMissing) {
        nameInputEl.setCustomValidity(" ")
        nameInputErrorEl.innerHTML = "This field is required"
        if (!nameInputEl.classList.contains("invalid-input")) {
            nameInputEl.classList.add("invalid-input")
        }  
    } else if (nameInputEl.validity.patternMismatch) {
        nameInputEl.setCustomValidity(" ") 
        nameInputErrorEl.innerHTML = "Please, write your name"
        if (!nameInputEl.classList.contains("invalid-input")) {
            nameInputEl.classList.add("invalid-input")
        }  
    } else {
        nameInputEl.setCustomValidity("") 
        nameInputEl.reportValidity()
        nameInputErrorEl.innerHTML = ""
        nameInputEl.classList.remove("invalid-input")
    }
}

function validateEmail() {
    if (emailInputEl.validity.valueMissing) {
        emailInputEl.setCustomValidity(" ")
        emailInputErrorEl.innerHTML = "This field is required"
        if (!emailInputEl.classList.contains("invalid-input")) {
            emailInputEl.classList.add("invalid-input")
        }  
    } else if (emailInputEl.validity.typeMismatch) {
        emailInputEl.setCustomValidity(" ")
        emailInputErrorEl.innerHTML = "Please, write your email"
        if (!emailInputEl.classList.contains("invalid-input")) {
            emailInputEl.classList.add("invalid-input")
        }  
    } else {
        emailInputEl.setCustomValidity("")
        emailInputEl.reportValidity()
        emailInputErrorEl.innerHTML = ""
        emailInputEl.classList.remove("invalid-input")
    }
}

function validateNumber() {
    if (phoneNumberEl.validity.valueMissing) {
        phoneNumberEl.setCustomValidity(" ")
        phoneNumberErrorEl.innerHTML = "This field is required"
        if (!phoneNumberEl.classList.contains("invalid-input")) {
            phoneNumberEl.classList.add("invalid-input")
        }  
    } else if (phoneNumberEl.validity.patternMismatch) {
        phoneNumberEl.setCustomValidity(" ") 
        phoneNumberErrorEl.innerHTML = "Please, write your number"
        if (!phoneNumberEl.classList.contains("invalid-input")) {
            phoneNumberEl.classList.add("invalid-input")
        }  
    } else {
        phoneNumberEl.setCustomValidity("") 
        phoneNumberEl.reportValidity()
        phoneNumberErrorEl.innerHTML = ""
        emailInputEl.classList.remove("invalid-input")
    }
}