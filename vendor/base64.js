var b64s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function s2r(f){var d,j,i;var h="",b=0,g=0;var e=f.length;for(i=0;i<e;i++){j=f.charCodeAt(i);if(g==0){h+=b64s.charAt((j>>2)&63);d=(j&3)<<4}else{if(g==1){h+=b64s.charAt((d|(j>>4)&15));d=(j&15)<<2}else{if(g==2){h+=b64s.charAt(d|((j>>6)&3));b+=1;if((b%60)==0){h+="\n"}h+=b64s.charAt(j&63)}}}b+=1;if((b%60)==0){h+="\n"}g+=1;if(g==3){g=0}}if(g>0){h+=b64s.charAt(d);b+=1;if((b%60)==0){h+="\n"}h+="=";b+=1;if((b%60)==0){h+="\n"}}if(g==1){h+="="}return h}function r2s(e){var i,h;var g="",f=0,b=0;var d=e.length;for(h=0;h<d;h++){i=b64s.indexOf(e.charAt(h));if(i>=0){if(f){g+=String.fromCharCode(b|(i>>(6-f))&255)}f=(f+2)&7;b=(i<<f)&255}}return g};