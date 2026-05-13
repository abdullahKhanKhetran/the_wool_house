import { useEffect, useMemo, useRef, useState } from "react";
import { images, collections, galleryTiles, reviews } from "./data";

/* ------------------- reveal-on-scroll ------------------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------- flower cursor ------------------- */
function FlowerSVG({ stroke = false, color = "#ffffff" }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="-20 -20 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {petals.map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-10"
          rx="4.2"
          ry="8.4"
          transform={`rotate(${deg})`}
          fill={stroke ? "none" : color}
          stroke={stroke ? color : "none"}
          strokeWidth={stroke ? 1.4 : 0}
        />
      ))}
      {!stroke && <circle cx="0" cy="0" r="3" fill={color} />}
    </svg>
  );
}

function FlowerCursor() {
  const smallRef = useRef(null);
  const bigRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    document.body.classList.add("flower-cursor-on");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let bx = mx;
    let by = my;
    let raf = 0;
    let seen = false;

    const setSmall = () => {
      if (!smallRef.current) return;
      smallRef.current.style.transform =
        `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      bx += (mx - bx) * 0.14;
      by += (my - by) * 0.14;
      if (bigRef.current) {
        bigRef.current.style.transform =
          `translate3d(${bx}px, ${by}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      setSmall();
      if (!seen) {
        seen = true;
        smallRef.current?.classList.add("visible");
        bigRef.current?.classList.add("visible");
      }
    };

    const onLeave = () => {
      smallRef.current?.classList.remove("visible");
      bigRef.current?.classList.remove("visible");
    };
    const onEnter = () => {
      if (seen) {
        smallRef.current?.classList.add("visible");
        bigRef.current?.classList.add("visible");
      }
    };

    const onOver = (e) => {
      const target = e.target?.closest?.(
        "a, button, [role='button'], input, textarea, .tile, .col-img, .rev-card"
      );
      if (target) bigRef.current?.classList.add("hover");
      else bigRef.current?.classList.remove("hover");
    };

    const onDown = () => bigRef.current?.classList.add("active");
    const onUp = () => bigRef.current?.classList.remove("active");

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("flower-cursor-on");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={smallRef} className="flower-cursor small" aria-hidden>
        <span className="flower-inner">
          <FlowerSVG />
        </span>
      </div>
      <div ref={bigRef} className="flower-cursor big" aria-hidden>
        <span className="flower-inner">
          <FlowerSVG stroke />
        </span>
      </div>
    </>
  );
}

/* ------------------- atoms ------------------- */
function Squiggle({ color = "currentColor" }) {
  return (
    <svg className="squiggle" viewBox="0 0 80 16" fill="none" aria-hidden>
      <path
        d="M2 8 Q 10 1, 18 8 T 34 8 T 50 8 T 66 8 T 78 8"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Star({ filled = true }) {
  return (
    <svg viewBox="0 0 24 24" className="star" aria-hidden>
      <path
        d="M12 2.3l2.95 6.4 6.95.78-5.2 4.78 1.45 6.94L12 17.77 5.85 21.2 7.3 14.26 2.1 9.48l6.95-.78z"
        fill={filled ? "var(--burgundy)" : "transparent"}
        stroke="var(--burgundy)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stars({ n = 5 }) {
  return (
    <span className="stars" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < n} />
      ))}
    </span>
  );
}

const formatINR = (n) =>
  "Rs " + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const IG_HANDLE = "the_wool_house1";
const IG_PROFILE = `https://www.instagram.com/${IG_HANDLE}/`;
const IG_DM = `https://ig.me/m/${IG_HANDLE}`;

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) { /* fall through */ }
  // Fallback for older browsers
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch (_) { /* ignore */ }
  document.body.removeChild(ta);
  return false;
}

/* ------------------- cart hook ------------------- */
function useCart() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const add = (product) =>
    setItems((curr) => {
      const found = curr.find((it) => it.id === product.id);
      if (found) {
        return curr.map((it) =>
          it.id === product.id ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [
        ...curr,
        { id: product.id, name: product.name, priceValue: product.priceValue, image: product.image, qty: 1 },
      ];
    });

  const remove = (id) =>
    setItems((curr) => curr.filter((it) => it.id !== id));

  const setQty = (id, qty) =>
    setItems((curr) =>
      qty <= 0
        ? curr.filter((it) => it.id !== id)
        : curr.map((it) => (it.id === id ? { ...it, qty } : it))
    );

  const count = items.reduce((s, it) => s + it.qty, 0);
  const total = items.reduce((s, it) => s + it.priceValue * it.qty, 0);

  return { items, add, remove, setQty, count, total, open, setOpen };
}

/* ------------------- nav ------------------- */
function Nav({ cartCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  return (
    <nav className={`nav ${menuOpen ? "menu-open" : ""}`}>
      <a href="#top" className="wordmark" onClick={close}>The Wool House</a>
      <div className="nav-right">
        <div className="links">
          <a href="#collections" onClick={close}>Collections</a>
          <a href="#reviews" onClick={close}>Notes</a>
          <a href="#atelier" onClick={close}>Atelier</a>
          <a href="#order" onClick={close}>Order</a>
          <a href={IG_PROFILE} target="_blank" rel="noreferrer" onClick={close}>
            Instagram
          </a>
        </div>
        <button
          className="cart-btn"
          onClick={() => { close(); onCartOpen(); }}
          aria-label="Open cart"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 7h12l-1.2 9.4a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L6 7z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span className="cart-label">Cart</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

/* ------------------- hero ------------------- */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="left">
        <div className="meta-row reveal">
          <span className="estd">Atelier · Est. 2024</span>
          <Squiggle color="var(--burgundy)" />
          <span className="estd">No. 01 / Spring Edit</span>
        </div>

        <h1 className="title display reveal delay-1">
          <span className="row">The Wool</span>
          <span className="row indent">
            <em className="ital">House</em>
            <span className="amp">.</span>
          </span>
        </h1>

        <p className="sub reveal delay-2">
          Eternal flowers, popcorn-stitch adornments, and small comforts in
          yarn — each piece slow-made by a single pair of hands.
        </p>

        <div className="status-pill reveal delay-3">
          <span className="dot" />
          <span>Currently accepting orders for May &amp; June</span>
        </div>

        <div className="cta-row reveal delay-4">
          <a className="btn" href="#order">Place an Order</a>
          <a className="btn ghost" href="#collections">See Collections</a>
        </div>
      </div>

      <div className="right reveal delay-2">
        <span className="corner-tag tag-no">Plate i — Burgundy Peonies</span>
        <div
          className="hero-img"
          style={{ "--img": `url(${images.bouquetBurgundyPeonies})` }}
        />
        <span className="corner-tag tag-loc">
          Held in hand — Studio The Wool House
        </span>
      </div>
    </section>
  );
}

/* ------------------- manifesto ------------------- */
function Manifesto() {
  return (
    <section className="manifesto">
      <div className="inner reveal">
        <span className="stitch-rule">— stitch by stitch —</span>
        <p className="quote">
          We believe a flower can be made <em>slowly</em>, by hand, in cotton
          and time — and still mean everything a fresh bloom does, only for
          much, much longer.
        </p>
        <p className="quote-attr">A note from the atelier</p>
      </div>
    </section>
  );
}

/* ------------------- collections w/ add-to-cart ------------------- */
function Collections({ onAdd }) {
  return (
    <section className="collections" id="collections">
      <div className="head">
        <h2 className="section-title reveal">
          The <em>Catalogue</em>
        </h2>
        <p className="head-blurb reveal delay-1">
          Three small chapters of work. Each piece is hand-crocheted on order
          — colours can be customised, and bouquets can be re-arranged to
          your own palette. Prices are starting points; add what you'd like
          to the cart and we'll confirm details at checkout.
        </p>
      </div>

      {collections.map((c, i) => (
        <article
          className={`collection ${i % 2 === 1 ? "reverse" : ""}`}
          key={c.number}
        >
          <div
            className="col-img reveal"
            style={{ "--img": `url(${c.image})` }}
          />
          <div className="col-body reveal delay-2">
            <div className="col-num">{c.number}</div>
            <h3 className="col-title">
              {c.title.split("\n").map((line, idx) =>
                idx === 0 ? (
                  <span key={idx}>{line}<br /></span>
                ) : (
                  <em key={idx}>{line}</em>
                )
              )}
            </h3>
            <p className="col-text">{c.blurb}</p>
            <ul className="col-list">
              {c.items.map((it) => (
                <li key={it.id}>
                  <div className="row-text">
                    <span className="name">{it.name}</span>
                    <span className="row-desc">— {it.desc}</span>
                  </div>
                  <span className="price">{it.price}</span>
                  {it.inStock === false ? (
                    <a className="add-btn ghost-add" href="#order">Enquire</a>
                  ) : (
                    <button
                      className="add-btn"
                      onClick={() => onAdd(it)}
                      aria-label={`Add ${it.name} to cart`}
                    >
                      <span>Add</span>
                      <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}

/* ------------------- gallery ------------------- */
function Gallery() {
  return (
    <section className="gallery">
      <div className="gal-head">
        <h2 className="reveal">
          Recent <em>blooms</em>
        </h2>
        <p className="gal-blurb reveal delay-1">
          A small archive from the last few months — bouquets sent to homes,
          weddings, and a few first apartments. Hover to see the plate name.
        </p>
      </div>
      <div className="grid">
        {galleryTiles.map((t, i) => (
          <div
            key={i}
            className={`tile reveal delay-${(i % 4) + 1} ${t.c}`}
            style={{ "--img": `url(${t.src})` }}
          >
            <span className="cap">{t.cap}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------- reviews (horizontal carousel) ------------------- */
function Reviews() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector(".rev-card");
    if (!first) return;
    const step = first.getBoundingClientRect().width + 32; // gap
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Track active card based on scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cards = Array.from(track.querySelectorAll(".rev-card"));
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((c, i) => {
        const cardCenter = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(cardCenter - center);
        if (d < minDist) { minDist = d; closest = i; }
      });
      setActiveIdx(closest);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // Drag-to-scroll (desktop)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = false;

    const onDown = (e) => {
      isDown = true; moved = false;
      track.classList.add("dragging");
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onLeave = () => { isDown = false; track.classList.remove("dragging"); };
    const onUp = () => { isDown = false; track.classList.remove("dragging"); };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.1;
      if (Math.abs(walk) > 4) moved = true;
      track.scrollLeft = scrollLeft - walk;
    };
    // Prevent click on cards after a drag
    const onClick = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };

    track.addEventListener("mousedown", onDown);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("mouseup", onUp);
    track.addEventListener("mousemove", onMove);
    track.addEventListener("click", onClick, true);
    return () => {
      track.removeEventListener("mousedown", onDown);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("mouseup", onUp);
      track.removeEventListener("mousemove", onMove);
      track.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <section className="reviews" id="reviews">
      <div className="rev-head">
        <span className="eyebrow">From the postbag</span>
        <h2 className="reveal">
          Notes from <em>customers</em>
        </h2>
        <p className="gal-blurb reveal delay-1">
          A few kind words from people who've kept a piece of the studio on
          their wrists, walls and bedside tables. Drag, swipe or use the
          arrows.
        </p>
        <div className="rev-controls reveal delay-2">
          <button
            className="rev-nav"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous review"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6"/>
            </svg>
          </button>
          <div className="rev-dots" role="tablist">
            {reviews.map((_, i) => (
              <span
                key={i}
                className={`rev-dot ${i === activeIdx ? "active" : ""}`}
                aria-hidden
              />
            ))}
          </div>
          <button
            className="rev-nav"
            onClick={() => scrollByCard(1)}
            aria-label="Next review"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="rev-track" ref={trackRef}>
        {reviews.map((r, i) => (
          <article className="rev-card" key={i}>
            <div
              className="rev-img"
              style={{ "--img": `url(${r.image})` }}
            >
              <span className="rev-plate">Plate {String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="rev-body">
              <Stars n={r.stars} />
              <p className="rev-quote">"{r.quote}"</p>
              <div className="rev-foot">
                <div>
                  <div className="rev-name">{r.name}</div>
                  <div className="rev-loc">{r.location}</div>
                </div>
                <div className="rev-item">{r.item}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------- atelier ------------------- */
function Atelier() {
  return (
    <section className="atelier" id="atelier">
      <div className="body reveal">
        <span className="eyebrow">The Atelier</span>
        <h2>
          One pair of hands,<br /> one ball of yarn at a <em>time</em>.
        </h2>
        <p>
          The Wool House began as a few rosebuds gifted to a friend and grew,
          stitch by stitch, into a small studio. Every piece is crocheted by
          one maker, on order — no factories, no shortcuts, no two pieces
          exactly alike.
        </p>
        <p>
          We work mostly in soft cotton and a hand-dyed wool blend. Bouquets
          are wrapped in matte paper and tied with satin; adornments arrive
          in muslin pouches; everything is made to be kept.
        </p>
        <div className="signature">— with care, The Wool House</div>

        <div className="stats">
          <div className="stat reveal delay-2">
            <div className="num">300+</div>
            <div className="lbl">Pieces made</div>
          </div>
          <div className="stat reveal delay-3">
            <div className="num">14</div>
            <div className="lbl">Days, avg. lead time</div>
          </div>
          <div className="stat reveal delay-4">
            <div className="num">1</div>
            <div className="lbl">Pair of hands</div>
          </div>
        </div>
      </div>

      <div className="frame reveal delay-2">
        <div
          className="frame-img"
          style={{ "--img": `url(${images.flowerRosesCozy})` }}
        />
        <span className="floating-tag">Studio, after dark</span>
      </div>
    </section>
  );
}

/* ------------------- order ------------------- */
function Order({ onCartOpen, cartCount }) {
  return (
    <section className="order" id="order">
      <div className="inner">
        <div>
          <span className="eyebrow" style={{ color: "var(--blush)" }}>
            How to order
          </span>
          <h2 className="reveal">
            Tell us what<br /> you have in <em>mind</em>.
          </h2>
          <p
            style={{
              maxWidth: 460,
              marginTop: 24,
              color: "rgba(243,233,216,0.75)",
              fontSize: 16,
              lineHeight: 1.65,
            }}
            className="reveal delay-1"
          >
            Add pieces to your cart for a quick checkout, or send a DM for
            anything custom. Either way, we'll confirm colours and timing
            before your order goes onto the hook.
          </p>
          <div className="cta reveal delay-2">
            <button className="btn" onClick={onCartOpen}>
              Open Cart {cartCount > 0 ? `· ${cartCount}` : ""}
            </button>
            <a
              className="btn ghost"
              href={IG_DM}
              target="_blank"
              rel="noreferrer"
            >
              DM on Instagram
            </a>
          </div>
        </div>

        <div>
          <div className="step reveal delay-1">
            <span className="n">01</span>
            <div>
              <h4>Add to cart, or note</h4>
              <p>
                Choose from the catalogue or share a reference photo for a
                custom piece.
              </p>
            </div>
          </div>
          <div className="step reveal delay-2">
            <span className="n">02</span>
            <div>
              <h4>We confirm details</h4>
              <p>
                Colours, lead time, shipping address — and any sketches or
                yarn samples needed before we begin.
              </p>
            </div>
          </div>
          <div className="step reveal delay-3">
            <span className="n">03</span>
            <div>
              <h4>Made by hand</h4>
              <p>
                Your piece is stitched, blocked, wrapped and shipped — with
                a small handwritten note tucked inside.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------- footer ------------------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="top">
        <div>
          <div className="mark">
            The Wool <em>House</em>
          </div>
          <p style={{ marginTop: 18, maxWidth: 420, color: "var(--ink-soft)" }}>
            A small handmade crochet atelier — eternal flowers, soft adornments
            and quiet objects, made one stitch at a time.
          </p>
        </div>
        <div>
          <h5>Visit</h5>
          <ul>
            <li>
              <a
                href="https://www.instagram.com/the_wool_house1/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li><a href="#collections">Collections</a></li>
            <li><a href="#reviews">Customer notes</a></li>
            <li><a href="#atelier">Atelier</a></li>
            <li><a href="#order">Order</a></li>
          </ul>
        </div>
        <div>
          <h5>Reach Us</h5>
          <ul>
            <li><a href="mailto:hello@thewoolhouse.shop">hello@thewoolhouse.shop</a></li>
            <li><a href="https://www.instagram.com/the_wool_house1/" target="_blank" rel="noreferrer">@the_wool_house1</a></li>
            <li><a href="#order">Custom orders</a></li>
          </ul>
        </div>
      </div>
      <div className="bottom">
        <span>© {new Date().getFullYear()} The Wool House</span>
        <span>Made by hand · Site stitched in React</span>
      </div>
    </footer>
  );
}

/* ------------------- cart drawer ------------------- */
function CartDrawer({ cart, onToast }) {
  const { items, setQty, remove, total, open, setOpen } = cart;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const shipping = items.length === 0 ? 0 : 250;
  const grandTotal = total + shipping;

  const checkoutText = useMemo(() => {
    if (items.length === 0) return "";
    const lines = items.map(
      (it) => `• ${it.name} × ${it.qty} — ${formatINR(it.priceValue * it.qty)}`
    );
    return `Hi The Wool House — I'd like to place an order:\n\n${lines.join("\n")}\n\nSubtotal: ${formatINR(total)}\nShipping: ${formatINR(shipping)}\nTotal: ${formatINR(grandTotal)}\n\nPlease confirm availability and timing. Thanks!`;
  }, [items, total, shipping, grandTotal]);

  const handleInstagramCheckout = async () => {
    await copyText(checkoutText);
    onToast("Order copied · paste into the DM");
    window.open(IG_DM, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        className={`cart-backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      />
      <aside className={`cart ${open ? "open" : ""}`} aria-hidden={!open}>
        <header className="cart-head">
          <div>
            <span className="eyebrow">Your basket</span>
            <h3 className="cart-title">The <em>Cart</em></h3>
          </div>
          <button className="cart-close" onClick={() => setOpen(false)} aria-label="Close cart">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19"/>
            </svg>
          </button>
        </header>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="serif-italic" style={{ fontSize: 22, color: "var(--ink)" }}>
                Your basket is empty.
              </p>
              <p style={{ marginTop: 12, color: "var(--ink-soft)", fontSize: 14 }}>
                Add a bouquet, scrunchie or small comfort from the catalogue.
              </p>
              <button className="btn" style={{ marginTop: 24 }} onClick={() => setOpen(false)}>
                Browse the catalogue
              </button>
            </div>
          ) : (
            <ul className="cart-list">
              {items.map((it) => (
                <li key={it.id} className="cart-row">
                  <div className="cart-thumb" style={{ backgroundImage: `url(${it.image})` }} />
                  <div className="cart-info">
                    <div className="cart-name">{it.name}</div>
                    <div className="cart-unit">{formatINR(it.priceValue)} each</div>
                    <div className="qty">
                      <button onClick={() => setQty(it.id, it.qty - 1)} aria-label="Decrease">−</button>
                      <span>{it.qty}</span>
                      <button onClick={() => setQty(it.id, it.qty + 1)} aria-label="Increase">+</button>
                      <button className="qty-remove" onClick={() => remove(it.id)}>Remove</button>
                    </div>
                  </div>
                  <div className="cart-sub">{formatINR(it.priceValue * it.qty)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-foot">
            <div className="totals">
              <div className="row"><span>Subtotal</span><span>{formatINR(total)}</span></div>
              <div className="row"><span>Shipping (est.)</span><span>{formatINR(shipping)}</span></div>
              <div className="row total"><span>Total</span><span>{formatINR(grandTotal)}</span></div>
            </div>
            <a
              className="btn checkout-btn"
              href={`https://wa.me/?text=${encodeURIComponent(checkoutText)}`}
              target="_blank"
              rel="noreferrer"
            >
              Checkout via WhatsApp
            </a>
            <button
              type="button"
              className="btn ghost checkout-btn checkout-ig"
              onClick={handleInstagramCheckout}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Checkout via Instagram DM
            </button>
            <p className="cart-note">
              WhatsApp opens with your order pre-filled. Instagram doesn't
              allow pre-filled DMs, so we'll copy your order to the clipboard —
              just paste it into the chat.
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}

/* ------------------- toast ------------------- */
function Toast({ message }) {
  return (
    <div className={`toast ${message ? "show" : ""}`} aria-live="polite">
      <Squiggle color="var(--cream)" />
      <span>{message}</span>
    </div>
  );
}

/* ------------------- root ------------------- */
export default function App() {
  useReveal();
  const cart = useCart();
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const handleAdd = (product) => {
    cart.add(product);
    showToast(`Added · ${product.name}`);
  };

  return (
    <>
      <FlowerCursor />
      <Nav cartCount={cart.count} onCartOpen={() => cart.setOpen(true)} />
      <Hero />
      <Manifesto />
      <Collections onAdd={handleAdd} />
      <Gallery />
      <Reviews />
      <Atelier />
      <Order onCartOpen={() => cart.setOpen(true)} cartCount={cart.count} />
      <Footer />
      <CartDrawer cart={cart} onToast={showToast} />
      <Toast message={toast} />
    </>
  );
}
