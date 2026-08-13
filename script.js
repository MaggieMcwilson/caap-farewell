document.addEventListener('DOMContentLoaded',()=>{
  AOS.init({once:true, duration:700});

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // GSAP ScrollTrigger registration
  if(gsap && gsap.registerPlugin){
    try{ gsap.registerPlugin(ScrollTrigger); }catch(e){}
  }

  const enterBtn=document.getElementById('enterBtn');
  const doorL=document.querySelector('.door-left');
  const doorR=document.querySelector('.door-right');

  enterBtn.addEventListener('click',()=>{
    if(prefersReduced){
      document.getElementById('landing').style.display='none';
      document.getElementById('hall1').scrollIntoView({behavior:'smooth'});
      return;
    }
    gsap.to(doorL,{x:'-100%',duration:1.1,ease:'power2.inOut'});
    gsap.to(doorR,{x:'100%',duration:1.1,ease:'power2.inOut',onComplete:()=>{
      document.getElementById('landing').style.display='none';
      document.getElementById('hall1').scrollIntoView({behavior:'smooth'});
    }});
  });

  // Artifact click -> open modal with contextual text
  const artifactModalEl = document.getElementById('artifactModal');
  const artifactModal = new bootstrap.Modal(artifactModalEl);
  const artifactTitle = document.getElementById('artifactTitle');
  const artifactBody = document.getElementById('artifactBody');

  const artifactData = {
    calculator:{title:'Artifact #001 — The Calculator',body:'A faithful desk companion. Used for quick tallies during reconciliations. What we learned: double-check inputs. Story: late-night checks saved a report.'},
    spreadsheet:{title:'Artifact #002 — The Spreadsheet',body:'The dynamic spreadsheet where entries, formulas and validation live. What we learned: structure matters. Story: a shared sheet helped coordinate tasks.'},
    report:{title:'Artifact #003 — The Report',body:'The first formal report submitted by the interns. What we learned: clarity in communication. Story: the report earned praise from the team.'},
    filing:{title:'Artifact #004 — The Filing System',body:'A cabinet of forms and memos. What we learned: organization prevents headaches. Story: finding an old memo unlocked context.'},
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
  fpItems.forEach((item, idx)=>{
    gsap.from(item,{y:40,opacity:0,duration:0.8,scrollTrigger:{trigger:item,start:'top 85%',toggleActions:'play none none none'}});
    ScrollTrigger.create({trigger:item,start:'top 80%',onEnter:()=>{
      // unlock badge for this milestone
      const badge = document.createElement('div'); badge.className='badge-item'; badge.textContent=item.dataset.day||('Milestone '+(idx+1)); badgesEl.appendChild(badge);
      seen++; const pct = Math.round((seen/total)*100); document.getElementById('overallProgress').style.width = pct+'%';
    }});
  });

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
    'Supervisor Alvin: "Your dedication made a difference."',
    'Mentor Maria: "Keep asking why — it leads to learning."',
    'Colleague C. Santos: "You survived the busiest month. Well done!"'
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
    const v = +m.dataset.value || 60; gsap.to(m.querySelector('::after')||m,{duration:1,css:{'--dummy':1},onUpdate:()=>{}});
    m.style.setProperty('--value',v);
    m.querySelectorAll; // no-op to avoid lint
    // visual fallback: fill width via pseudo-element is in CSS, here just set background width
    const fill = document.createElement('div'); fill.style.width = '0%'; fill.style.height='100%'; fill.style.background='linear-gradient(90deg,#0d6efd,#00b5ff)'; fill.style.borderRadius='6px'; m.appendChild(fill);
    gsap.to(fill,{width:Math.min(100,v)+'%',duration:1.2,delay:0.2});
  });

  // Crew wall click -> show message modal
  document.querySelectorAll('.id-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const person = card.dataset.person || 'staff'; const messages = {
        sup1:'Alvin A. — "Proud of your steady progress. Keep it up."',
        mentor1:'Maria B. — "Always ask for context. It helps you grow."',
        acct1:'C. Santos — "Thanks for keeping the ledgers tidy."',
        fin1:'R. Lopez — "See you at the next briefing!"'
      };
      artifactTitle.textContent='Message from the Crew'; artifactBody.innerHTML='<p>'+ (messages[person]||'Thank you for your service.') +'</p>'; artifactModal.show();
    });
  });

  // Final gate: when final is visible, dim museum and animate plane takeoff
  const plane=document.getElementById('plane');
  ScrollTrigger.create({trigger:document.getElementById('final'),start:'top 60%',onEnter:()=>{
    document.body.classList.add('dimmed');
    gsap.to(plane,{x:'120%',y:'-120%',rotation:10,duration:3,ease:'power3.in'});
    setTimeout(()=>{
      const finalTxt = document.createElement('div'); finalTxt.className='final-text text-center'; finalTxt.innerHTML='<h3>Every journey eventually reaches its final gate.</h3><p>Thank you, CAAP Bacolod.</p>'; document.getElementById('final').appendChild(finalTxt);
    },1600);
  }});

  // CAAP logo secret click
  let logoCount=0; const logo=document.getElementById('caapLogo');
  logo.addEventListener('click',()=>{ logoCount++; if(logoCount>=5){ const modal=new bootstrap.Modal(document.getElementById('secretModal')); modal.show(); logoCount=0 } });

  // Paper airplane follows mouse
  const planeEl=document.createElement('div'); planeEl.className='paper-plane'; planeEl.innerHTML='✈️'; document.body.appendChild(planeEl);
  document.addEventListener('mousemove',e=>{ gsap.to(planeEl,{x:e.clientX,y:e.clientY,duration:0.4}) });

  // Simple hidden blooper gallery toggle (double-click header)
  header=document.querySelector('header'); header.addEventListener('dblclick',()=>{
    const modal=new bootstrap.Modal(document.getElementById('secretModal')); modal.show();
  });
});
