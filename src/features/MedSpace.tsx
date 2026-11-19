import {useMemo,useState} from 'react';
import {BookOpen,Heart,ExternalLink,Search,Bookmark,Activity,BrainCircuit,BookMarked} from 'lucide-react';
import {facts} from '../data/facts';
import {Section,Card,Banner} from '../components/UI';
import {useStored} from '../lib/useStored';

export default function MedSpace(){
 const [category,setCategory]=useState('All');
 const [query,setQuery]=useState('');
 const [savedOnly,setSavedOnly]=useState(false);
 const [favorites,setFavorites,ready,error]=useStored<string[]>('favorites',[]);
 const categories=['All',...new Set(facts.map(f=>f.category))];
 const pathways=[{name:'Anatomy',description:'Structures, systems and body essentials',icon:BookMarked},{name:'Physiology',description:'How living systems work together',icon:Activity},{name:'Neuroscience',description:'Explore the brain and nervous system',icon:BrainCircuit}];
 const shown=useMemo(()=>facts.filter(f=>(category==='All'||f.category===category)&&(!savedOnly||favorites.includes(f.id))&&`${f.title} ${f.body} ${f.category}`.toLowerCase().includes(query.trim().toLowerCase())),[category,query,savedOnly,favorites]);
 return <Section eyebrow="Curiosity is a quiet kind of joy" title="MedSpace" description="Thoughtfully curated science and medical knowledge, for students and curious minds alike.">
 <div className="medspace-intro"><div><strong>Small discoveries, big curiosity.</strong><p>Browse short, source-linked medical facts whenever you need a lighter study break.</p></div><span>{facts.length} curated facts</span></div>
 <div className="learning-paths"><h2>Choose a learning path</h2><div className="learning-path-grid">{pathways.map(path=><button key={path.name} className={`learning-path ${category===path.name?'active':''}`} onClick={()=>{setCategory(c=>c===path.name?'All':path.name);setSavedOnly(false);}} aria-pressed={category===path.name}><span className="learning-path-icon"><path.icon size={20}/></span><span><strong>{path.name}</strong><small>{path.description} · {facts.filter(f=>f.category===path.name).length} facts</small></span></button>)}</div></div>
 <div className="medspace-tools"><label className="medspace-search"><Search size={18}/><span className="sr-only">Search facts</span><input aria-label="Search facts" placeholder="Search anatomy, brain, sleep..." value={query} onChange={e=>setQuery(e.target.value)}/></label><button className={`chip ${savedOnly?'selected':''}`} aria-pressed={savedOnly} onClick={()=>setSavedOnly(v=>!v)}><Bookmark size={15}/> Saved ({favorites.length})</button></div>
 <div className="chip-row" role="group" aria-label="Filter facts">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`chip ${category===c?'selected':''}`} aria-pressed={category===c}>{c}</button>)}</div>
 {error&&<Banner type="warn">{error}</Banner>}
 <div className="medspace-results-head"><p className="results-label" aria-live="polite">Showing {shown.length} {shown.length===1?'fact':'facts'}</p>{(query||category!=='All'||savedOnly)&&<button className="mini-button" onClick={()=>{setQuery('');setCategory('All');setSavedOnly(false);}}>Reset browsing</button>}</div>
 {shown.length===0?<div className="medspace-empty"><BookOpen size={30}/><h2>No matching discoveries</h2><p>Try another search or category.</p><button className="button secondary" onClick={()=>{setQuery('');setCategory('All');setSavedOnly(false);}}>Clear filters</button></div>:<div className="fact-grid">{shown.map((fact,i)=><Card key={fact.id} className="fact-card"><div className={`fact-number hue-${i%4}`}><BookOpen size={22}/></div><div className="fact-meta"><span className="tag">{fact.category}</span><button className={`icon-button heart-button ${favorites.includes(fact.id)?'liked':''}`} disabled={!ready} onClick={()=>setFavorites(old=>old.includes(fact.id)?old.filter(x=>x!==fact.id):[...old,fact.id])} aria-label={`${favorites.includes(fact.id)?'Remove':'Save'} ${fact.title}`} aria-pressed={favorites.includes(fact.id)}><Heart size={19} fill={favorites.includes(fact.id)?'currentColor':'none'}/></button></div><h2>{fact.title}</h2><p className="muted">{fact.body}</p><a target="_blank" rel="noopener noreferrer" href={fact.url} className="source-link">{fact.source}<ExternalLink size={14}/></a></Card>)}</div>}
 <Banner>Educational information only. These short summaries include links to reference resources, not personalized medical advice. Review the original source before academic or clinical use.</Banner>
 </Section>;
}
