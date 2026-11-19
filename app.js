const STORAGE_KEY = 'strategyRoomMvpV1';
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
  sessionId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  path: null, dataMode: null, current: 0, answers: {}, events: [], feedback: [], interest: null
};

const questions = [
  {id:'direction',domain:'CLARITY',title:'إلى أي درجة اتجاه الشركة واضح ومفهوم؟',why:'فكر في قدرة الإدارة على شرح الاتجاه في جمل بسيطة ومتسقة.',dimension:'Clarity',options:[['4','واضح ومشترك','الإدارة تقدر تشرحه بنفس المعنى'],['3','واضح نسبيًا','موجود لكن فيه اختلافات في التفسير'],['2','عام','طموح واسع من غير اختيارات محددة'],['1','غير واضح','كل إدارة شايفة اتجاه مختلف']]},
  {id:'customer',domain:'FOCUS',title:'هل محددين بوضوح مين العميل أو القطاع اللي هنركز عليه؟',why:'التركيز معناه اختيار، مش محاولة خدمة كل العملاء بنفس الطريقة.',dimension:'Focus',options:[['4','محدد بدقة','قطاعات وأولويات واضحة'],['3','محدد جزئيًا','عندنا segments لكن الأولوية غير حاسمة'],['2','واسع جدًا','نستهدف معظم السوق'],['1','غير محدد','مفيش اختيار واضح']]},
  {id:'win',domain:'FOCUS',title:'هل واضح ليه العميل هيختارنا بدل البدائل؟',why:'نبحث عن سبب محدد ومثبت، مش أوصاف عامة زي الجودة والخدمة.',dimension:'Focus',options:[['4','واضح ومثبت','سبب الاختيار محدد ومدعوم'],['3','واضح لكن غير مثبت','عندنا تصور يحتاج دليل'],['2','عام','جودة أو خدمة أو سعر من غير تميّز واضح'],['1','غير معروف','لا يوجد جواب متفق عليه']]},
  {id:'evidence',domain:'MARKET UNDERSTANDING',title:'قرارات السوق والعملاء مبنية على إيه؟',why:'اختار الأقرب لطريقة اتخاذ القرارات حاليًا.',dimension:'Market Understanding',options:[['4','بيانات وأبحاث حديثة','ومراجعة مباشرة مع العملاء'],['3','بيانات جزئية وخبرة الإدارة','الصورة مفيدة لكنها غير مكتملة'],['2','خبرة وانطباعات بالأساس','الأدلة محدودة'],['1','افتراضات غير مختبرة','لا نعرف مدى صحتها']]},
  {id:'competition',domain:'MARKET UNDERSTANDING',title:'هل نعرف المنافسين والبدائل الحقيقية وطريقة تحركهم؟',why:'المنافس مش لازم يكون شركة شبهك؛ ممكن يكون بديلًا مختلفًا يحل نفس المشكلة.',dimension:'Market Understanding',options:[['4','صورة محدثة ومقارنة واضحة','تشمل strategic groups والبدائل'],['3','نعرف المنافسين الرئيسيين','لكن المقارنة غير منتظمة'],['2','معرفة عامة','معلومات متفرقة وقديمة'],['1','رؤية محدودة','لا يوجد تحليل واضح']]},
  {id:'capabilities',domain:'READINESS',title:'هل حددنا القدرات اللي لازم نملكها علشان ننجح؟',why:'الطموح لا يكفي؛ لازم نعرف ما الذي يجب أن نجيده بصورة مختلفة.',dimension:'Readiness',options:[['4','محددة ومقيمة','نعرف نقاط القوة والفجوات'],['3','محددة بصورة عامة','لكن من غير تقييم كامل'],['2','مفهومة ضمنيًا','غير موثقة أو متفق عليها'],['1','غير محددة','الخطة لا تربط النجاح بالقدرات']]},
  {id:'resources',domain:'READINESS',title:'هل الموارد والوقت والميزانية متناسبة مع الطموح؟',why:'التقييم هنا عن واقعية التنفيذ، مش عن قوة الطموح.',dimension:'Readiness',options:[['4','متناسبة ومخصصة بوضوح','الأولويات لها موارد فعلية'],['3','متاحة جزئيًا','توجد فجوات قابلة للعلاج'],['2','غير مؤكدة','المبادرات أكثر من الموارد'],['1','غير متناسبة','الطموح منفصل عن الإمكانيات']]},
  {id:'initiatives',domain:'FIT',title:'هل المبادرات الحالية بتخدم نفس الاختيارات الاستراتيجية؟',why:'المبادرات القوية منفردة ممكن تسحب الشركة في اتجاهات متعارضة.',dimension:'Fit',options:[['4','مترابطة وتدعم بعضها','كل مبادرة مرتبطة باختيار واضح'],['3','معظمها مرتبط','مع وجود بعض التشتت'],['2','قائمة مشروعات','الربط بالاستراتيجية ضعيف'],['1','متعارضة أو غير واضحة','صعب تحديد الاتجاه المشترك']]},
  {id:'tradeoffs',domain:'FIT',title:'هل واضح إيه اللي الشركة اختارت ما تعملوش؟',why:'الاستراتيجية الحقيقية تتطلب trade-offs وحدودًا تحمي التركيز.',dimension:'Fit',options:[['4','اختيارات وحدود واضحة','نعرف ما نرفضه ولماذا'],['3','فيه أولويات','لكن الحدود غير حاسمة'],['2','نحاول نعمل معظم الفرص','التركيز ضعيف'],['1','لا توجد trade-offs','كل شيء أولوية']]},
  {id:'execution',domain:'ACTION',title:'هل الاستراتيجية مترجمة إلى مسؤوليات ومقاييس ومراجعات؟',why:'نبحث عن نظام تنفيذ ومراجعة، مش مجرد أهداف سنوية.',dimension:'Action',options:[['4','أهداف وملاك ومقاييس ومراجعات','المنظومة متصلة بالقرارات'],['3','معظم العناصر موجودة','لكن الربط أو المراجعة غير مكتمل'],['2','مبادرات وtargets فقط','منطق التنفيذ غير واضح'],['1','عرض أو وثيقة','لا يوجد نظام متابعة']]}
];

const sampleAnswers = {direction:'3',customer:'4',win:'3',evidence:'2',competition:'3',capabilities:'2',resources:'2',initiatives:'2',tradeoffs:'1',execution:'2'};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function sendToFreeEndpoint(endpoint,payload){
  if(!endpoint)return;
  fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}).catch(()=>{});
}
function track(name,meta={}){const event={sessionId:state.sessionId,name,at:new Date().toISOString(),screen:visibleSection(),path:state.path,dataMode:state.dataMode,...meta};state.events.push(event);save();sendToFreeEndpoint(window.STRATEGY_ROOM_CONFIG?.eventEndpoint,event);}
function visibleSection(){return [...document.querySelectorAll('main>section')].find(x=>!x.hidden)?.id||'landing';}
function show(id){$$('main>section').forEach(s=>s.hidden=true);const el=$(id);el.hidden=false;window.scrollTo({top:0,behavior:'smooth'});}
function openModal(id){const m=$('#'+id);m.classList.add('open');m.setAttribute('aria-hidden','false');}
function closeModal(id){const m=$('#'+id);m.classList.remove('open');m.setAttribute('aria-hidden','true');}

function begin(sample=false){track('assessment_start',{sample});show('#paths');if(sample){state.dataMode='sample';}}
$$('[data-action="begin"]').forEach(b=>b.onclick=()=>begin(false));
$$('[data-action="sample"]').forEach(b=>b.onclick=()=>begin(true));
$$('[data-path]').forEach(b=>b.onclick=()=>{state.path=b.dataset.path;track('path_selected',{path:state.path});save();if(state.dataMode==='sample'){state.answers={...sampleAnswers};startAssessment();}else show('#dataChoice');});
$$('[data-data-mode]').forEach(b=>b.onclick=()=>{state.dataMode=b.dataset.dataMode;track('data_mode_selected',{dataMode:state.dataMode});if(state.dataMode==='sample')state.answers={...sampleAnswers};save();startAssessment();});

function startAssessment(){state.current=0;save();show('#assessment');$('#assessmentTitle').textContent=state.path==='challenge'?'Business Plan Challenge Preview':'Build Your Strategy Preview';renderQuestion();track('assessment_questions_started');}
function renderQuestion(){const q=questions[state.current],selected=state.answers[q.id];const pct=Math.round((state.current/questions.length)*100);$('#progressText').textContent=`${pct}% · ${state.current+1}/${questions.length}`;$('#progressBar').style.width=pct+'%';$('#questionHost').innerHTML=`<article class="question-card"><div class="domain">${q.domain}</div><h3>${q.title}</h3><p class="why">${q.why}</p><div class="option-list">${q.options.map(o=>`<label><input type="radio" name="answer" value="${o[0]}" ${selected===o[0]?'checked':''}><span><b>${o[1]}</b><small>${o[2]}</small></span></label>`).join('')}</div><label class="field-label">ملاحظة اختيارية<textarea id="questionNote" rows="2" placeholder="أضف context أو تعليق يساعد على فهم الإجابة">${state.answers[q.id+'_note']||''}</textarea></label></article>`;$('#prevQuestion').disabled=state.current===0;$('#nextQuestion').textContent=state.current===questions.length-1?'اعرض النتيجة':'التالي';track('question_viewed',{question:q.id,index:state.current});}
function capture(){const q=questions[state.current],picked=$('input[name="answer"]:checked');if(!picked)return false;state.answers[q.id]=picked.value;state.answers[q.id+'_note']=$('#questionNote').value.trim();save();return true;}
$('#nextQuestion').onclick=()=>{if(!capture()){track('question_validation_error',{question:questions[state.current].id});alert('اختار الإجابة الأقرب قبل ما تكمل.');return;}track('question_completed',{question:questions[state.current].id,value:state.answers[questions[state.current].id]});if(state.current<questions.length-1){state.current++;renderQuestion();}else completeAssessment();};
$('#prevQuestion').onclick=()=>{capture();if(state.current>0){state.current--;renderQuestion();}};

function completeAssessment(){track('assessment_complete',{answered:questions.filter(q=>state.answers[q.id]).length});renderResults();show('#results');track('results_viewed');}
function calculate(){const grouped={};questions.forEach(q=>{(grouped[q.dimension]??=[]).push(Number(state.answers[q.id]||1));});const scores={};Object.entries(grouped).forEach(([k,v])=>scores[k]=Math.round(v.reduce((a,b)=>a+b,0)/v.length/4*100));const overall=Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.values(scores).length);return{scores,overall};}
function renderResults(){const {scores,overall}=calculate();$('#overallScore').textContent=overall+'%';$('#scoreGrid').innerHTML=Object.entries(scores).map(([k,v])=>`<article class="score-card"><div><b>${k}</b><span>${v}%</span></div><div class="mini-track"><i style="width:${v}%"></i></div></article>`).join('');const best=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,2),low=Object.entries(scores).sort((a,b)=>a[1]-b[1]).slice(0,3);$('#strengthFindings').innerHTML=best.map(([k,v])=>finding(k,positiveText(k),v,'strength')).join('');$('#gapFindings').innerHTML=low.map(([k,v])=>finding(k,gapText(k),v,'gap')).join('');}
function finding(title,text,score,type){return `<article class="finding"><button data-finding="${type}:${title}"><span>${title}</span><span>${score}% +</span></button><p hidden>${text}</p></article>`;}
function positiveText(k){return({Clarity:'الاتجاه مفهوم بدرجة جيدة نسبيًا. المرحلة التالية هي اختبار هل نفس الفهم موجود عبر فريق الإدارة.',Focus:'فيه مؤشرات على اختيارات وأولويات واضحة يمكن البناء عليها.', 'Market Understanding':'القرارات تستند إلى فهم معقول للسوق؛ نحتاج فقط اختبار حداثة الأدلة وعمقها.',Readiness:'الطموح مرتبط بدرجة جيدة بالقدرات والموارد المتاحة.',Fit:'الاختيارات والمبادرات تظهر قدرًا جيدًا من الترابط.',Action:'يوجد أساس يمكن تحويله إلى مسؤوليات ومقاييس ومراجعة منتظمة.'})[k];}
function gapText(k){return({Clarity:'اختبر هل الإدارة تستطيع شرح الاتجاه بنفس المعنى، ثم حدد الاختيارات التي ما زالت غامضة.',Focus:'حدد بوضوح: هنخدم مين؟ هنكسب بإيه؟ وإيه اللي اختارنا ما نعملوش؟','Market Understanding':'ميّز بين الحقائق والافتراضات، وحدد الأدلة الناقصة عن العملاء والمنافسين.',Readiness:'اربط الطموح بالقدرات المطلوبة والموارد والفجوات التي يجب علاجها.',Fit:'راجع المبادرات كمنظومة واحدة: هل تدعم بعضها أم تتنافس على الموارد وتسحب الشركة في اتجاهات مختلفة؟',Action:'حوّل الاتجاه إلى أهداف محددة، owners، مقاييس، وإيقاع مراجعة يسمح بالتصحيح.'})[k];}
document.addEventListener('click',e=>{const b=e.target.closest('[data-finding]');if(b){const p=b.nextElementSibling;p.hidden=!p.hidden;track('finding_opened',{finding:b.dataset.finding});}});

$('#helpOpen').onclick=()=>{openModal('feedbackModal');track('feedback_opened',{question:questions[state.current]?.id});};
let feedbackType=null;$$('[data-feedback]').forEach(b=>b.onclick=()=>{$$('[data-feedback]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');feedbackType=b.dataset.feedback;});
$('#feedbackSubmit').onclick=()=>{state.feedback.push({type:feedbackType||'general',text:$('#feedbackText').value.trim(),question:questions[state.current]?.id||null,at:new Date().toISOString()});track('feedback_submitted',{type:feedbackType||'general'});$('#feedbackText').value='';feedbackType=null;closeModal('feedbackModal');};
$('#interestOpen').onclick=()=>{openModal('interestModal');track('founding_interest_opened');};
$('#interestSubmit').onclick=()=>{const selected=$('input[name="interest"]:checked');if(!selected){alert('اختار الخطوة الأقرب لك.');return;}state.interest={sessionId:state.sessionId,type:selected.value,email:$('#interestEmail').value.trim(),benefit:$('#foundingBenefit').checked,at:new Date().toISOString()};track('founding_interest',{type:selected.value,benefit:state.interest.benefit});sendToFreeEndpoint(window.STRATEGY_ROOM_CONFIG?.interestEndpoint,state.interest);$('#interestSuccess').hidden=false;save();};
$('#privacyOpen').onclick=()=>openModal('privacyModal');
$$('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id);}));
$('#eraseData').onclick=()=>{if(confirm('تمسح كل الإجابات والـevents المحفوظة على المتصفح؟')){localStorage.removeItem(STORAGE_KEY);location.reload();}};
$('#restart').onclick=()=>{state.path=null;state.dataMode=null;state.current=0;state.answers={};track('assessment_restarted');save();show('.hero');};
$('#exportData').onclick=()=>{track('data_exported');const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`strategy-room-session-${state.sessionId}.json`;a.click();URL.revokeObjectURL(a.href);};

track('landing_view');
