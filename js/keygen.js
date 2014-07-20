var rSeed=[],Rs=[];var Sr,Rsl,Rbits,Rbits2;var Rx=0,Ry=0;function r(a){return Math.floor(Math.random()*a)}function ror(b,d){d&=7;return d?((b>>d)|((b<<(8-d))&255)):b}function seed(d){var g=0,f=0;var a,e,b;while(g<d.length){while(g<d.length&&d.charCodeAt(g)<=32){g++}if(g<d.length){rSeed[f]=parseInt("0x"+d.substr(g,2))}g+=3;f++}Rsl=rSeed.length;Sr=r(256);Rbits=0;if(Rs.lengh==0){for(a=0;a<256;a++){Rs[a]=a}}e=0;for(a=0;a<256;a++){e=(rSeed[a]+d[a]+e)%256;b=d[a];d[a]=d[e];d[e]=b}Rx=Ry=0;alert("Random seed updated. Seed size is: "+Rsl)}function rc(){var a;Rx=++Rx&255;Ry=(Rs[Rx]+Ry)&255;a=Rs[Rx];Rs[Rx]=Rs[Ry];Rs[Ry]=a;Sr^=Rs[(Rs[Rx]+Rs[Ry])&255];Sr^=r(256);Sr^=ror(rSeed[r(Rsl)],r(8));Sr^=ror(rSeed[r(Rsl)],r(8));return Sr}function rand(d){if(d==2){if(!Rbits){Rbits=8;Rbits2=rc(256)}Rbits--;var b=Rbits2&1;Rbits2>>=1;return b}var a=1;b=0;while(d>a&&a>0){a<<=8;b=(b<<8)|rc()}if(b<0){b^=2147483648}return b%d}function beq(e,d){if(e.length!=d.length){return 0}for(var f=e.length-1;f>=0;f--){if(e[f]!=d[f]){return 0}}return 1}function blshift(e,d){var h,g=0;var f=new Array(e.length);for(h=0;h<e.length;h++){g|=(e[h]<<d);f[h]=g&bm;g>>=bs}if(g){f[h]=g}return f}function brshift(b){var g=0,f,e;var d=new Array(b.length);for(f=b.length-1;f>=0;f--){g<<=bs;e=b[f];d[f]=(e|g)>>1;g=e&1}f=d.length;if(d[f-1]){return d}while(f>1&&d[f-1]==0){f--}return d.slice(0,f)}function bgcd(f,g){var h,e,a=g.concat(),b=f.concat();for(;;){h=bsub(a,b);if(beq(h,[0])){return b}if(h.length){while((h[0]&1)==0){h=brshift(h)}a=h}else{e=a;a=b;b=e}}}function rnum(f){var h,d=1,g=0;var e=[];if(f==0){f=1}for(h=f;h>0;h--){if(rand(2)){e[g]|=d}d<<=1;if(d==bx2){d=1;g++}}return e}var Primes=[3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021];var sieveSize=4000;var sieve0=-1*sieveSize;var sieve=[];var lastPrime=0;function nextPrime(d){var e;if(d==Primes[lastPrime]&&lastPrime<Primes.length-1){return Primes[++lastPrime]}if(d<Primes[Primes.length-1]){for(e=Primes.length-2;e>0;e--){if(Primes[e]<=d){lastPrime=e+1;return Primes[e+1]}}}var b,a;d++;if((d&1)==0){d++}for(;;){if(d-sieve0>sieveSize||d<sieve0){for(e=sieveSize-1;e>=0;e--){sieve[e]=0}sieve0=d;primes=Primes.concat()}if(sieve[d-sieve0]==0){for(e=0;e<primes.length;e++){if((b=primes[e])&&d%b==0){for(a=d-sieve0;a<sieveSize;a+=b){sieve[a]=b}d+=2;primes[e]=0;break}}if(e>=primes.length){return d}}else{d+=2}}}function divisable(b,a){if((b[0]&1)==0){return 2}for(c=0;c<Primes.length;c++){if(Primes[c]>=a){return 0}if(simplemod(b,Primes[c])==0){return Primes[c]}}c=Primes[Primes.length-1];for(;;){c=nextPrime(c);if(c>=a){return 0}if(simplemod(b,c)==0){return c}}}function bPowOf2(d){var b=[],e,a=Math.floor(d/bs);for(e=a-1;e>=0;e--){b[e]=0}b[a]=1<<(d%bs);return b}function mpp(w){if(w<10){return[Primes[rand(Primes.length)]]}if(w<=20){return[nextPrime(rand(1<<w))]}var o=10,i=20,g=w*w/o,e,f,v,k,h,u,s,l,j,p;if(w>i*2){for(;;){e=Math.pow(2,Math.random()-1);if(w-e*w>i){break}}}else{e=0.5}f=mpp(Math.floor(e*w)+1);v=bPowOf2(w-2);v=bdiv(v,f).q;Il=v.length;for(;;){k=[];for(h=0;h<Il;h++){k[h]=rand(bx2)}k[Il-1]%=v[Il-1];k=bmod(k,v);if(!k[0]){k[0]|=1}k=badd(k,v);h=blshift(bmul(k,f),1);h[0]|=1;if(!divisable(h,g)){u=rnum(w-1);u[0]|=2;p=bsub(h,[1]);var t=bmodexp(u,p,h);if(beq(t,[1])){j=blshift(k,1);s=bsub(bmodexp(u,j,h),[1]);l=bgcd(s,h);if(beq(l,[1])){return h}}}}}function sub2(e,d){var f=bsub(e,d);if(f.length==0){this.a=bsub(d,e);this.sign=1}else{this.a=f;this.sign=0}return this}function signedsub(e,d){if(e.sign){if(d.sign){return sub2(d,e)}else{this.a=badd(e,d);this.sign=1}}else{if(d.sign){this.a=badd(e,d);this.sign=0}else{return sub2(e,d)}}return this}function modinverse(j,e){var g=e.concat(),k,d,l,i=[1],h=[0],f;i.sign=0;h.sign=0;while(g.length>1||g[0]){k=g.concat();d=bdiv(j,g);g=d.mod;q=d.q;j=k;k=h.concat();f=h.sign;l=bmul(h,q);l.sign=h.sign;d=signedsub(i,l);h=d.a;h.sign=d.sign;i=k;i.sign=f}if(j.length!=1||j[0]!=1){return[0]}if(i.sign){i=bsub(e,i)}return i}var rsa_p,rsa_q,rsa_e,rsa_d,rsa_pq,rsa_u;function rsaKeys(b){var d,a;b=parseInt(b);rsa_q=mpp(b);rsa_p=mpp(b);a=bmul(bsub(rsa_p,[1]),bsub(rsa_q,[1]));for(d=5;d<Primes.length;d++){rsa_e=[Primes[d]];rsa_d=modinverse(rsa_e,a);if(rsa_d.length!=1||rsa_d[0]!=0){break}}rsa_pq=bmul(rsa_p,rsa_q);rsa_u=modinverse(rsa_p,rsa_q);return};