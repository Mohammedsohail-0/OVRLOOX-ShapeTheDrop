import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC36Vnul2nr7BOfZyZXuMjDHA4a__yV4Mw",
  authDomain: "shape-the-drop.firebaseapp.com",
  databaseURL: "https://shape-the-drop-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shape-the-drop",
  storageBucket: "shape-the-drop.firebasestorage.app",
  messagingSenderId: "169234610810",
  appId: "1:169234610810:web:16771842b653c30e3019c3",
  measurementId: "G-WQNJYR3W0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const imageSets = {
  oldMoney: ["oldmoney1.jpg", "oldmoney2.jpg", "oldmoney3.jpg", "oldmoney4.jpg", "oldmoney5.jpg"],
  streetWear: ["streetwear1.jpg", "streetwear2.jpg", "streetwear3.jpg", "streetwear4.jpg", "streetwear5.jpg", "streetwear6.jpg", "streetwear7.jpg", "streetwear8.jpg"],
  casuals: ["casuals1.jpg", "casuals2.jpg", "casuals3.jpg", "casuals4.jpg", "casuals5.jpg"]
};

document.addEventListener('DOMContentLoaded', () => {
  // Select buttons
  const casualsBtn = document.getElementById("casualBtn");
  const oldMoneyBtn = document.getElementById("oldMoneyBtn");
  const streetWearBtn = document.getElementById("streetWearBtn");
  const streetWearProceedBtn = document.getElementById("streetWearProceedBtn");
  const casualsProceedBtn = document.getElementById("casualsProceedBtn");
  const oldMoneyProceedBtn = document.getElementById("oldMoneyProceedBtn");
  const colourPaletteProceedBtn = document.getElementById("colourPaletteProceedBtn");
  const priceRangeProceedBtn = document.getElementById("priceRangeProceedBtn");
  const timePeriodProceedBtn = document.getElementById("timePeriodProceedBtn");
  const personalDetailsProceedBtn = document.getElementById("personalDetailsProceedBtn");

  // Select sections
  const categoryInterest = document.getElementById("categoryInterest");
  const streetWearSec = document.getElementById("streetWearGrid"); // Fixed ID
  const oldMoneySec = document.getElementById("oldMoneyGrid");
  const casualsSec = document.getElementById("casualsGrid");
  const colourPreferenceSec = document.getElementById("colourPreference");
  const priceRangeSec = document.getElementById("priceRangeSec");
  const timePeriodSec = document.getElementById("timePeriodSec");
  const personalDetailsSec = document.getElementById("personalDetailsSec");
  const wowScreen = document.getElementById("wowScreen");

  // Single inputs
  const priceSlider = document.getElementById('priceRange');
  const priceDisplay = document.getElementById('priceValue');
  const timePeriodSelection = document.getElementById("timePeriodSelection");
  const userCountEL = document.getElementById("count");

  // Input information
  let selectedColour = null;
  let finalPrice = null;
  let selectedTimePeriod = null;

  // Style selections
  const selections = {
    oldMoney: [],
    casuals: [],
    streetWear: []
  };

  // Function to hide all sections
  function hideAllSections() {
    const sections = [categoryInterest, streetWearSec, oldMoneySec, casualsSec, colourPreferenceSec, priceRangeSec, timePeriodSec, personalDetailsSec, wowScreen];
    sections.forEach(section => {
      if (section) section.style.display = 'none';
    });
  }

  // Function to show a specific section
  function showSection(section) {
    if (section) {
      hideAllSections();
      section.style.display = section === colourPreferenceSec || section === streetWearSec || section === oldMoneySec || section === casualsSec ? 'grid' : 'block';
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error('Section not found:', section);
    }
  }

  // Image selection logic
  function setupImageSelection(gridEl, selectionArray) {
    if (!gridEl) {
      console.error('Grid element is null');
      return;
    }
    const images = gridEl.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('click', () => {
        const value = img.dataset.value;
        img.classList.toggle('selected');
        if (selectionArray.includes(value)) {
          selectionArray.splice(selectionArray.indexOf(value), 1);
        } else {
          selectionArray.push(value);
        }
        console.log(`${selectionArray.name || 'Images'} selected:`, selectionArray);
      });
    });
  }

  // Initialize image selection for all grids
  if (oldMoneySec) setupImageSelection(oldMoneySec, selections.oldMoney);
  if (casualsSec) setupImageSelection(casualsSec, selections.casuals);
  if (streetWearSec) setupImageSelection(streetWearSec, selections.streetWear);

  // Button event listeners
  if (casualsBtn) {
    casualsBtn.addEventListener('click', () => {
      console.log("casuals button clicked");
      showSection(casualsSec);
    });
  }

  if (oldMoneyBtn) {
    oldMoneyBtn.addEventListener('click', () => {
      console.log("oldmoney button clicked");
      showSection(oldMoneySec);
    });
  }

  if (streetWearBtn) {
    streetWearBtn.addEventListener('click', () => {
      console.log("streetwear button clicked");
      showSection(streetWearSec);
    });
  }

  if (oldMoneyProceedBtn) {
    oldMoneyProceedBtn.addEventListener('click', () => {
      if (selections.oldMoney.length > 0) {
        console.log('Old Money selected:', selections.oldMoney);
        showSection(colourPreferenceSec);
      } else {
        alert('Please select at least one Old Money style.');
      }
    });
  }

  if (casualsProceedBtn) {
    casualsProceedBtn.addEventListener('click', () => {
      if (selections.casuals.length > 0) {
        console.log('Casuals selected:', selections.casuals);
        showSection(colourPreferenceSec);
      } else {
        alert('Please select at least one Casuals style.');
      }
    });
  }

  if (streetWearProceedBtn) {
    streetWearProceedBtn.addEventListener('click', () => {
      if (selections.streetWear.length > 0) {
        console.log('Street Wear selected:', selections.streetWear);
        showSection(colourPreferenceSec);
      } else {
        alert('Please select at least one Street Wear style.');
      }
    });
  }

  // Colour selection
  const colourSection = document.querySelector('.colourPreference');
  if (colourSection) {
    const colourImages = colourSection.querySelectorAll('img');
    let tempSelectedColour = null;

    colourImages.forEach(img => {
      img.addEventListener('click', () => {
        colourImages.forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');
        tempSelectedColour = img.dataset.value;
        console.log('Temporary selected colour:', tempSelectedColour);
      });
    });

    if (colourPaletteProceedBtn) {
      colourPaletteProceedBtn.addEventListener('click', () => {
        if (tempSelectedColour) {
          selectedColour = tempSelectedColour;
          console.log('Final selected colour:', selectedColour);
          showSection(priceRangeSec);
        } else {
          alert('Please select a colour before proceeding!');
        }
      });
    }
  }

  // Price range
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', () => {
      priceDisplay.textContent = priceSlider.value;
    });
  }

  if (priceRangeProceedBtn) {
    priceRangeProceedBtn.addEventListener('click', () => {
      finalPrice = priceSlider.value;
      console.log('Selected price:', finalPrice);
      showSection(timePeriodSec);
    });
  }

  // Time period
  if (timePeriodProceedBtn) {
    timePeriodProceedBtn.addEventListener('click', () => {
      selectedTimePeriod = timePeriodSelection.value;
      if (!selectedTimePeriod) {
        alert('Please select a time period!');
        return;
      }
      console.log('Selected time period:', selectedTimePeriod);
      showSection(personalDetailsSec);
    });
  }

  // Personal details and Firebase submission
  class UserSelection {
    constructor(name, age, contact, styleSelections, colour, priceRange, timePeriod) {
      this.name = name;
      this.age = age;
      this.contact = contact;
      this.styleSelections = styleSelections;
      this.colour = colour;
      this.priceRange = priceRange;
      this.timePeriod = timePeriod;
    }
  }

  if (personalDetailsProceedBtn) {
    personalDetailsProceedBtn.addEventListener('click', () => {
      const name = document.getElementById('userName').value;
      const age = parseInt(document.getElementById('userAge').value);
      const contact = document.getElementById('contact').value;

      // Validation
      if (!name || !age || !contact) {
        alert('Please fill all personal details!');
        return;
      }
      if (age < 18) {
        alert('Age must be 18 or older.');
        return;
      }

      // Create object
      const userData = new UserSelection(
        name,
        age,
        contact,
        selections,
        selectedColour,
        finalPrice,
        selectedTimePeriod
      );

      console.log('Final user data:', userData);
      finalSubmit(name);
      push(ref(db, 'users'), userData)
        .then(() => alert('Response saved successfully!'))
        .catch(err => console.error('Error saving data:', err));
    });
  }

  // User count
  const usersRef = ref(db, 'users');
  onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    const userCount = users ? Object.keys(users).length : 0;
    if (userCountEL) {
      userCountEL.textContent = userCount;
    }
    console.log('Total users:', userCount);
  });

  // CTA button
  const ctaBtn = document.getElementById('cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      console.log("CTA button clicked");
      showSection(categoryInterest);
    });
  }

  // Wow screen
  function finalSubmit(name) {
    showSection(wowScreen);
    // Dim screen
    document.body.classList.add("dimmed");

    // Small loading animation
    const loader = document.createElement("div");
    loader.className = "loader";
    document.body.appendChild(loader);

    setTimeout(() => {
      loader.remove();
      document.body.classList.remove("dimmed");

      // 🎉 Confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2000);
  }

  // Wow screen buttons
  window.stayTuned = function() {
    wowScreen.classList.add("hidden");
    showSection(categoryInterest);
  };

  window.inviteFriends = function() {
    alert('Invite friends via social media or email!');
    wowScreen.classList.add("hidden");
    showSection(categoryInterest);
  };
});