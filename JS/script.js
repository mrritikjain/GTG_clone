/* ================= MENU ================= */
      function toggleMenu() {
        document.getElementById("mobileMenu").classList.toggle("active");
      }

      /* ================= GALLERY ================= */
      const images = [
        "./Assets/pord1.png",
        "./Assets/prod2.png",
        "./Assets/prod3.png",
        "./Assets/prod4.png",
        "./Assets/prod5.png",
      ];
      let curIndex = 0;

      function initGallery() {
        const track = document.getElementById("galleryTrack");
        const dots = document.getElementById("dotsContainer");
        const thumbs = document.getElementById("thumbsContainer");

        images.forEach((img, i) => {
          const slide = document.createElement("div");
          slide.className = "gallery-slide";
          slide.innerHTML = `<img src="${img}">`;
          track.appendChild(slide);

          const dot = document.createElement("div");
          dot.className = `dot ${i === 0 ? "active" : ""}`;
          dot.onclick = () => setSlide(i);
          dots.appendChild(dot);

          const thumb = document.createElement("div");
          thumb.className = `thumb ${i === 0 ? "active" : ""}`;
          thumb.innerHTML = `<img src="${img}">`;
          thumb.onclick = () => setSlide(i);
          thumbs.appendChild(thumb);
        });
      }
      function setSlide(i) {
        curIndex = i;
        document.getElementById(
          "galleryTrack"
        ).style.transform = `translateX(-${curIndex * 100}%)`;
        document
          .querySelectorAll(".dot")
          .forEach((d, idx) => d.classList.toggle("active", idx === i));
        document
          .querySelectorAll(".thumb")
          .forEach((t, idx) => t.classList.toggle("active", idx === i));
      }
      function changeSlide(d) {
        let n = curIndex + d;
        if (n < 0) n = images.length - 1;
        if (n >= images.length) n = 0;
        setSlide(n);
      }
      initGallery();

      /* ================= LOGIC ================= */
      const frags = [
        {
          id: "original",
          img: "./Assets/perfume1.png",
          name: "Original",
          bestSeller: true,
        },
        {
          id: "lily",
          img: "./Assets/perfume2.png",
          name: "Lily",
        },
        {
          id: "rose",
          img: "./Assets/perfume3.png",
          name: "Rose",
        },
      ];

      let state = {
        type: "single",
        singleFrag: "original",
        doubleFrag1: "original",
        doubleFrag2: "lily",
        included: "monthly" /* Default included option */,
      };

      function renderFrags(cid, key) {
        const c = document.getElementById(cid);
        c.innerHTML = "";
        frags.forEach((f) => {
          const d = document.createElement("div");
          d.className = `fragrance-card ${
            state[key] === f.id ? "selected" : ""
          }`;
          d.onclick = (e) => {
            e.stopPropagation();
            state[key] = f.id;
            renderAll();
            updateBtn(); // Ensure button updates on selection
          };

          let badgeHtml = f.bestSeller
            ? '<div class="best-seller-tag">BEST SELLER</div>'
            : "";

          // Name First, Then Image
          d.innerHTML = `
            ${badgeHtml}
            <span>${f.name}</span>
            <img src="${f.img}">
          `;
          c.appendChild(d);
        });
      }

      function selectIncluded(plan, val) {
        // Only update if we are in the active plan, or update global state?
        // User wants selection to result in URL change.
        state.included = val;

        // Visual Update
        // Remove 'selected' from all inc-box in the current plan block
        // Actually we should distinct single vs double state or just one included state.
        // Let's assume one global preference for simplicity as user didn't specify per-plan difference, but physically they are different DOM elements.

        document.querySelectorAll(".inc-box").forEach((el) => {
          el.classList.remove("selected");
          if (
            el.getAttribute("data-val") === val &&
            el.getAttribute("data-plan") === state.type
          ) {
            el.classList.add("selected");
          }
        });
        updateBtn();
      }

      // Sync initial state visual
      function initIncludedVisuals() {
        document
          .querySelectorAll(
            `.inc-box[data-plan="${state.type}"][data-val="${state.included}"]`
          )
          .forEach((el) => el.classList.add("selected"));
      }

      function renderAll() {
        renderFrags("single-frag-grid", "singleFrag");
        renderFrags("double-frag-1-grid", "doubleFrag1");
        renderFrags("double-frag-2-grid", "doubleFrag2");
      }

      function setPurchaseType(t) {
        state.type = t;
        document
          .querySelectorAll(".sub-card")
          .forEach((e) => e.classList.remove("active"));
        document.getElementById("option-" + t).classList.add("active");

        // Reset or keep included state? Let's keep it but refresh visual
        // Deselect all then select matches
        document
          .querySelectorAll(".inc-box")
          .forEach((el) => el.classList.remove("selected"));
        document
          .querySelectorAll(
            `.inc-box[data-plan="${state.type}"][data-val="${state.included}"]`
          )
          .forEach((el) => el.classList.add("selected"));

        updateBtn();
      }

      function updateBtn() {
        const btn = document.getElementById("addToCartBtn");
        let params = new URLSearchParams();
        params.append("subscription", state.type);

        if (state.type === "single") {
          params.append("fragrance", state.singleFrag);
        } else if (state.type === "double") {
          params.append("fragrance1", state.doubleFrag1);
          params.append("fragrance2", state.doubleFrag2);
        }
        params.append("included_option", state.included);

        btn.innerHTML = "Add to Cart";
        btn.setAttribute("href", `?${params.toString()}`);
      }

      renderAll();
      initIncludedVisuals();
      updateBtn();

      function toggleAcc(el) {
        const c = el.querySelector(".acc-content");
        const i = el.querySelector(".acc-icon");
        if (c.style.height) {
          c.style.height = null;
          i.innerText = "+";
        } else {
          c.style.height = c.scrollHeight + "px";
          i.innerText = "-";
        }
      }

      const obs = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("visible");
          }),
        { threshold: 0.1 }
      );
      document
        .querySelectorAll(".reveal-on-scroll")
        .forEach((e) => obs.observe(e));

      let counted = false;
      new IntersectionObserver(
        (es) => {
          if (es[0].isIntersecting && !counted) {
            counted = true;
            document.querySelectorAll(".perc-item h2").forEach((el) => {
              const t = +el.getAttribute("data-target");
              let c = 0;
              const upd = () => {
                c += t / 40;
                if (c < t) {
                  el.innerText = Math.ceil(c) + "%";
                  setTimeout(upd, 30);
                } else el.innerText = t + "%";
              };
              upd();
            });
          }
        },
        { threshold: 0.5 }
      ).observe(document.getElementById("countSection"));