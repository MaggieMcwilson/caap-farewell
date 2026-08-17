document.addEventListener('DOMContentLoaded',()=>{
  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPhone = window.matchMedia('(max-width: 768px)').matches;
  AOS.init({once:true, duration:700, disable: () => isPhone});

  const gsapReady = typeof gsap !== 'undefined';
  const scrollTriggerReady = typeof ScrollTrigger !== 'undefined';

  const lockEntranceScroll = () => {
    document.body.classList.add('entrance-locked');
    document.documentElement.classList.add('entrance-locked');
    window.scrollTo({top:0, left:0, behavior:'auto'});
  };

  const unlockEntranceScroll = () => {
    document.body.classList.remove('entrance-locked');
    document.documentElement.classList.remove('entrance-locked');
  };

  const preventScrollWhileClosed = (event) => {
    if (!document.body.classList.contains('entrance-locked')) return;

    const key = event.key;
    const scrollKeys = ['ArrowDown','ArrowUp','PageDown','PageUp','Space','Home','End'];
    if (event.type === 'wheel' || event.type === 'touchmove' || scrollKeys.includes(key)) {
      event.preventDefault();
    }
  };

  window.addEventListener('wheel', preventScrollWhileClosed, { passive: false });
  window.addEventListener('touchmove', preventScrollWhileClosed, { passive: false });
  window.addEventListener('keydown', preventScrollWhileClosed);
  lockEntranceScroll();

  // GSAP ScrollTrigger registration
  if(gsapReady && gsap.registerPlugin && scrollTriggerReady){
    try{ gsap.registerPlugin(ScrollTrigger); }catch(e){}
  }

  const enterBtn=document.getElementById('enterBtn');
  const gateVisual=document.querySelector('.entry-visual');
  const gateImage=document.querySelector('.gate-image');

  if(gsapReady && !prefersReduced){
    // Ambient floating lights across the scene to make sections feel alive.
    const motionStage = document.createElement('div');
    motionStage.className = 'motion-stage';
    document.body.appendChild(motionStage);

    for(let i=0;i<12;i++){
      const orb = document.createElement('span');
      orb.className = 'motion-orb';
      const size = 40 + Math.random()*130;
      orb.style.width = size + 'px';
      orb.style.height = size + 'px';
      orb.style.left = Math.random()*100 + '%';
      orb.style.top = Math.random()*100 + '%';
      motionStage.appendChild(orb);

      gsap.to(orb, {
        x: () => (Math.random() * 180) - 90,
        y: () => (Math.random() * 220) - 110,
        opacity: () => 0.12 + Math.random()*0.25,
        duration: 6 + Math.random()*7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    gsap.timeline({defaults:{ease:'power3.out'}})
      .from('.landing-inner > *',{opacity:0,y:28,stagger:0.1,duration:0.7})
      .from('#enterBtn',{scale:0.92,duration:0.45},'-=0.3');

    gsap.to('#enterBtn',{y:-5,repeat:-1,yoyo:true,duration:1.25,ease:'sine.inOut'});

    if(gateImage && !isPhone){
      document.addEventListener('mousemove',(event)=>{
        const xShift = ((event.clientX / window.innerWidth) - 0.5) * 14;
        const yShift = ((event.clientY / window.innerHeight) - 0.5) * 10;
        gsap.to(gateImage,{x:xShift,y:yShift,duration:0.9,ease:'power2.out'});
      });
    }

    if(!isPhone){
      gsap.utils.toArray('.artifact-card, .id-card').forEach((card)=>{
      card.addEventListener('mousemove',(event)=>{
        const rect = card.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card,{rotationY:relX*6,rotationX:relY*-6,transformPerspective:800,transformOrigin:'center',duration:0.25,ease:'power1.out'});
      });
      card.addEventListener('mouseleave',()=>{
        gsap.to(card,{rotationY:0,rotationX:0,duration:0.35,ease:'power2.out'});
      });
      });
    }
  }

  if(enterBtn){
    enterBtn.addEventListener('click',()=>{
      if(prefersReduced || !gsapReady){
        unlockEntranceScroll();
        document.getElementById('landing').style.display='none';
        document.getElementById('hall1').scrollIntoView({behavior:'smooth'});
        return;
      }

      gsap.to(gateVisual,{opacity:0, scale:1.06, duration:1.1, ease:'power2.inOut', onComplete:()=>{
        unlockEntranceScroll();
        document.getElementById('landing').style.display='none';
        document.getElementById('hall1').scrollIntoView({behavior:'smooth'});
      }});
    });
  }

  if(gsapReady && scrollTriggerReady && !prefersReduced){
    gsap.to('.gate-image',{
      scale:1.16,
      yPercent:9,
      ease:'none',
      scrollTrigger:{trigger:'#landing',start:'top top',end:'bottom top',scrub:true}
    });

    gsap.utils.toArray('main section:not(#landing)').forEach((section)=>{
      const revealTargets = section.querySelectorAll('h2, .artifact-card, .id-card, .frame, .frame-large, .departure-board, .lead');
      if(!revealTargets.length) return;

      if(isPhone){
        gsap.fromTo(revealTargets,
          {y:90, opacity:0.12, scale:0.95},
          {
            y:-60,
            opacity:1,
            scale:1,
            stagger:0.06,
            ease:'none',
            scrollTrigger:{
              trigger:section,
              start:'top bottom',
              end:'bottom top',
              scrub:1.2
            }
          }
        );
      } else {
        gsap.from(revealTargets,{
          y:34,
          opacity:0,
          duration:0.78,
          stagger:0.06,
          ease:'power2.out',
          scrollTrigger:{trigger:section,start:'top 78%'}
        });
      }
    });

    gsap.utils.toArray('.exhibit-photo, .frame-large img, .frame-sm img').forEach((img)=>{
      gsap.to(img,{
        yPercent:isPhone ? -16 : -8,
        ease:'none',
        scrollTrigger:{trigger:img,start:'top bottom',end:'bottom top',scrub:true}
      });
    });

    if(isPhone){
      gsap.utils.toArray('.artifact-card, .id-card, .boarding-pass').forEach((card)=>{
        gsap.to(card,{
          yPercent:-10,
          ease:'none',
          scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:1.5}
        });
      });
    }
  }

  // Artifact click -> open modal with contextual text
  const artifactModalEl = document.getElementById('artifactModal');
  const artifactModal = new bootstrap.Modal(artifactModalEl);
  const artifactTitle = document.getElementById('artifactTitle');
  const artifactBody = document.getElementById('artifactBody');

  const artifactData = {
    calculator:{title:'Artifact #001 — The Calculator',body:'A faithful desk companion. -- double-check inputs.'},
    spreadsheet:{title:'Artifact #002 — The Scratchs',body:'Used daily. -- be resourceful.'},
    report:{title:'Artifact #003 — The Paid Stamp',body:'Kauti uti sa pagstamp kang mga dokumento.'},
    filing:{title:'Artifact #004 — The Sign here',body:'Ang dila aka sign here ang kailangan sa pagpa-sign.'},
    desk:{title:'Artifact #005 — The Office Desk',body:'A personal workspace with notes, pens, and coffee rings. What we learned: small rituals help productivity. Humorous note: the sticker that survived three interns.'}
  };

  document.querySelectorAll('.artifact-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const id=card.dataset.artifact; const info=artifactData[id]||{title:'Artifact',body:'No info available.'};
      artifactTitle.textContent=info.title; artifactBody.innerHTML='<p>'+info.body+'</p>'; artifactModal.show();
    });
  });

  // Flight path ScrollTrigger animation and badge unlocking
  const fpItems = document.querySelectorAll('.fp-item');
  const badgesEl = document.getElementById('badges');
  const total = fpItems.length; let seen=0;
  if(scrollTriggerReady && fpItems.length){
    fpItems.forEach((item, idx)=>{
      if(gsapReady){
        gsap.from(item,{y:40,opacity:0,duration:0.8,scrollTrigger:{trigger:item,start:'top 85%',toggleActions:'play none none none'}});
      }
      ScrollTrigger.create({trigger:item,start:'top 80%',onEnter:()=>{
        const badge = document.createElement('div'); badge.className='badge-item'; badge.textContent=item.dataset.day||('Milestone '+(idx+1)); badgesEl.appendChild(badge);
        seen++; const pct = Math.round((seen/total)*100); document.getElementById('overallProgress').style.width = pct+'%';
      }});
    });
  }

  // Memory exhibition: clicking thumbnails swaps hero image and opens lightbox
  const hero = document.getElementById('heroPhoto');
  document.querySelectorAll('.frame-sm img').forEach(img=>{
    img.style.cursor='zoom-in';
    img.addEventListener('click',()=>{
      hero.src = img.src; document.getElementById('lbImage').src = img.src; document.getElementById('lbCaption').textContent = img.dataset.caption||''; document.getElementById('lightbox').style.display='flex';
    });
  });
  document.getElementById('heroPhoto')?.addEventListener('click',()=>{ document.getElementById('lbImage').src = hero.src; document.getElementById('lightbox').style.display='flex'; });

  // Lightbox close handlers
  const lightbox=document.getElementById('lightbox');
  const lbImg=document.getElementById('lbImage');
  const lbCaption=document.getElementById('lbCaption');
  document.getElementById('lbClose').addEventListener('click',()=>lightbox.style.display='none');
  lightbox.addEventListener('click',(e)=>{ if(e.target===lightbox) lightbox.style.display='none' });

  // Radio typing simulation
  const radioFeed = document.getElementById('radioFeed');
  const transmissions = [
    'Miss Ja: "Live a little!"',
    'Miss Clarence: "Keep asking why — it leads to learning."',
    'Miss Lorena: "Di anay kamo magnobya nobya, ha. Skwela danay."'
  ];
  let tIndex=0;
  function typeTransmission(){
    radioFeed.innerHTML=''; const msg = transmissions[tIndex%transmissions.length]; const p=document.createElement('div'); p.className='radio-msg'; radioFeed.appendChild(p);
    let k=0; const interval=setInterval(()=>{
      p.textContent = msg.slice(0,k++);
      if(k>msg.length){ clearInterval(interval); tIndex++; setTimeout(typeTransmission,2200); }
    },40);
  }
  typeTransmission();

  // Simple meters animation
  document.querySelectorAll('.meter').forEach(m=>{
    const v = +m.dataset.value || 60;
    if(gsapReady){
      gsap.to(m.querySelector('::after')||m,{duration:1,css:{'--dummy':1},onUpdate:()=>{}});
    }
    m.style.setProperty('--value',v);
    m.querySelectorAll; // no-op to avoid lint
    // visual fallback: fill width via pseudo-element is in CSS, here just set background width
    const fill = document.createElement('div'); fill.style.width = '0%'; fill.style.height='100%'; fill.style.background='linear-gradient(90deg,#0d6efd,#00b5ff)'; fill.style.borderRadius='6px'; m.appendChild(fill);
    if(gsapReady){
      gsap.to(fill,{width:Math.min(100,v)+'%',duration:1.2,delay:0.2});
    }else{
      fill.style.width = Math.min(100,v)+'%';
    }
  });

  // Crew wall click -> show message modal
  document.querySelectorAll('.id-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const nameEl = card.querySelector('strong');
      const roleEl = card.querySelector('.small');
      const imgEl = card.querySelector('.crew-photo');
      const personName = nameEl ? nameEl.textContent.trim() : 'Crew Member';
      const personRole = roleEl ? roleEl.textContent.trim() : 'Finance Team';
      const personPhoto = imgEl ? imgEl.getAttribute('src') : '';

      const quotes = {
        'Miss Jing':'"Pa outgo danay, thank you!"',
        'Miss Bibing':'"kaon kamo! pagkaon ja oh."',
        'Miss Lorena':'"Kita niyo ja to ang balita oh!" "Pa-stamp bi kaja"',
        'Miss Clarence':'"Di kamo huya-huya sa pag-ask, ha. Ask lang kamo."',
        'Miss Juvy':'"Pa sort ako gang"',
        'Miss Ems':'"Pa butang dila-dila"',
        'Miss Francine':'"Ubosa niyo ja pagkaon oh!" "ano nanaman ja Wayne?!"🫢',
        'Sir Kyle':'Si mark tahimik lang HAHAHAHA'
      };

      const quote = quotes[personName] || '"Thank you for your service and dedication."';
      artifactTitle.textContent = personName + ' — ' + personRole;
      artifactBody.innerHTML =
        '<div class="text-center">' +
          '<img src="' + personPhoto + '" alt="' + personName + '" class="img-fluid rounded shadow-sm mb-3" style="max-height: 360px; object-fit: cover;">' +
          '<blockquote class="blockquote mb-0"><p class="fs-6">' + quote + '</p></blockquote>' +
        '</div>';
      artifactModal.show();
    });
  });

  // Final gate: when final is visible, dim museum and animate plane takeoff
  const plane=document.getElementById('plane');
  if(scrollTriggerReady && gsapReady && plane){
    ScrollTrigger.create({trigger:document.getElementById('final'),start:'top 60%',onEnter:()=>{
      document.body.classList.add('dimmed');
      gsap.to(plane,{x:'120%',y:'-120%',rotation:10,duration:3,ease:'power3.in'});
      setTimeout(()=>{
        const finalTxt = document.createElement('div'); finalTxt.className='final-text text-center'; finalTxt.innerHTML='<h3>Every journey eventually reaches its final gate.</h3><p>Thank you, CAAP Bacolod.</p>'; document.getElementById('final').appendChild(finalTxt);
      },1600);
    }});
  }

  // CAAP logo secret click
  let logoCount=0; const logo=document.getElementById('caapLogo');
  if(logo){
    logo.addEventListener('click',()=>{ logoCount++; if(logoCount>=5){ const modal=new bootstrap.Modal(document.getElementById('secretModal')); modal.show(); logoCount=0 } });
  }

  // Paper airplane follows mouse
  if(!isPhone){
    const planeEl=document.createElement('div'); planeEl.className='paper-plane'; planeEl.innerHTML='✈️'; document.body.appendChild(planeEl);
    document.addEventListener('mousemove',e=>{
      if(gsapReady){
        gsap.to(planeEl,{x:e.clientX,y:e.clientY,duration:0.4});
      }
    });
  }

  // Simple hidden blooper gallery toggle (double-click header)
  const header=document.querySelector('header');
  if(header){
    header.addEventListener('dblclick',()=>{
      const modal=new bootstrap.Modal(document.getElementById('secretModal')); modal.show();
    });
  }
});
