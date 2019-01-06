let search;
let puzzle = "RADIUMRLIINHRETMSLSANTIMONYRIL\nELURZIUMAVOHNEECEOICYIEREPPOCU\nUIRMETBITWTINNCNAEDTHITTUMATIM\nNMULEKCINURIDDHMBDTITRSRRUFLUS\nGRBTMMTAMODEYINOOEMNUGOCOBALTC\nMUIMUUOSUOLSNOEERREINMOMPGRDRA\nOUDAIAILIEPODCTBGRAUUTMUILEBON\nMCIGCBFRVRRAPMIMIOTMNMHMUURNKD\nTAUNNSMIOIRRRUUUUMRBHIPOMMMEII\nLLMEANUSCMMMMIMIMIEDGNLRRUBGIU\nIIESRMIBSRRUNSRHLRNSYBUUIIMIMM\nTFIIFURTONSEIUTTKLNOLHTVVBURUE\nHONUMIAEMHGMVMEESDYDCHOAARHMIE\nIROMHDMNGTRPAILMUIBRERNTNEOLSN\nUNNUTRANNMUINILODAGNENITATSASG\nMIMIMOSEIUCSUOURHNILABUZDDANAB\nLUUCUFOSSNTMMMRPLUFCSRMIIMPLHR\nBMIIIROSNEODYMIUMMEINLUGUULYUO\nNUMNCERIIDNEPTUNIUMNATIMMIALMM\nEHYRIHUNCBMANAMICIIEIRTPUDTUTI\nUIDERTIELYIUGUMLDNCSPRNMIIIION\nDEOPEUCMALUMINUMYAURSSOMLRNYME\nUREOMRTANOSSENAGOTLAIARLUIUBCM\nERSCAENMTMIUEEEMUILLAHTCHIMEUD\nLMAPHOSPHORUSCBLMTVCAESOTCDLLD\nMERCURYTAARGONAAEEMFDPNNPDROXO\nEAPOXYGENOTPYRKRRSNMUICLACGEHX\nAVNYTTRIUMUIDNIOBIUMUINEHRNNIR\nCERIUMUIMREFMLIEUOUMSILICONINC\nCESIUMUILEHIMUIMSONMBORONHMSZS";
let bank = [];
let ws, puzzleEntry;
let strings = [];
let grd = getMatrix(puzzle);
const w = 800,
  h = 800;

let foundWords = Array(grd.length).fill().map(() => Array(grd[0].length).fill(0));

function reverseString(string) {
  return string.split("").reverse().join("");
}

function getDiagonals(m) {
  let diags = new Array(m.length + m[0].length - 1);
  diags = diags.fill("");
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      diags[i + j] += m[i][j];
    }
  }
  return diags;
}

function getMatrix(arr) {
  let ans = [];
  let split = arr.split('\n');
  for (string of split) {
    ans.push(string.split(''))
  }
  return ans;
}

function setup() {
  ws = createCanvas(w, h);
  puzzleEntry = createElement('textarea');
  puzzleEntry.value(puzzle);
  search = createInput();
  puzzleEntry.size(275, h);
  puzzleEntry.changed(() => {
    puzzleEntry.value(puzzleEntry.value().toUpperCase())
    let valid = true;
    if (puzzleEntry.value()) {
      let split = puzzleEntry.value().split('\n');
      let len = split[0].length;
      for (spli of split) {
        if (spli.length !== len) {
          valid = false;
        }
      }
    }
    if (valid) {
      puzzle = puzzleEntry.value();
      grd = getMatrix(puzzle);
      genStrings();
      foundWords = Array(grd.length).fill().map(() => Array(grd[0].length).fill(0));
      findArray(bank);
    }
  });
  search.attribute('placeholder', 'Search');
  search.input(() => {
    foundWords = Array(grd.length).fill().map(() => Array(grd[0].length).fill(0));
    if (search.value())
      findWord(search.value());
    else
      findArray(bank);
  });
  genStrings();
  //all string acquired
  findArray(bank);
}

function genStrings() {
  strings = [];
  //add in all horizontal rows
  let split = puzzle.split('\n');
  for (string of split) {
    strings.push(string);
  }
  //add in all vertial column
  for (let i = 0; i < string.length; i++) {
    let topToBot = "";
    for (string of split) {
      topToBot += string[i];
    }
    strings.push(topToBot);
  }
  //add in all diagonals (/)
  let diags = getDiagonals(getMatrix(puzzle));
  for (diag of diags) {
    strings.push(diag);
  }
  //add in all diagonals (\)
  let newArr = [];
  for (stri of split) {
    newArr.push(reverseString(stri))
  }
  diags = getDiagonals(newArr);
  for (diag of diags) {
    strings.push(diag);
  }
}

function findArray(bank) {
  for (elm of bank) {
    if (!findWord(elm)) {
      // console.log(elm);
    }
  }
}

function findWord(word) {
  word = word.toUpperCase();
  let found = false;
  for (let i = 0; i < strings.length; i++) {
    if (strings[i].includes(word)) {
      found = true;
      if (i < grd.length) { //Horizontal
        for (let j = 0; j < word.length; j++) {
          foundWords[i][strings[i].indexOf(word) + j] = 1;
        }
      } else if (i < grd[0].length + grd.length) { // Vertical        
        for (let j = 0; j < word.length; j++) {
          foundWords[strings[i].indexOf(word) + j][i - grd.length] = 1;
        }
      } else if (i < (grd[0].length + grd.length) * 2 - 1) { //Diagonal(/)
        let row = 0;
        let col = i - (grd[0].length + grd.length);
        if (col > grd[0].length - 1) {
          row += col - (grd[0].length - 1);
          col = grd[0].length - 1;
        }
        col -= strings[i].indexOf(word);
        row += strings[i].indexOf(word);
        for (let j = 0; j < word.length; j++) {
          foundWords[row + j][col - j] = 1;
        }
      } else { //Diagonal(\)
        let row = 0;
        let col = 3 * grd[0].length - i + 2 * grd.length - 2;
        if (col < 0) {
          row -= col;
          col = 0;
        }
        col += strings[i].indexOf(word);
        row += strings[i].indexOf(word);
        for (let j = 0; j < word.length; j++) {
          foundWords[row + j][col + j] = 1;
        }
      }
    }
  }
  word = reverseString(word);
  for (let i = 0; i < strings.length; i++) {
    if (strings[i].includes(word)) {
      found = true;
      if (i < grd.length) { //Horizontal
        for (let j = 0; j < word.length; j++) {
          foundWords[i][strings[i].indexOf(word) + j] = 1;
        }
      } else if (i < grd[0].length + grd.length) { // Vertical        
        for (let j = 0; j < word.length; j++) {
          foundWords[strings[i].indexOf(word) + j][i - grd.length] = 1;
        }
      } else if (i < (grd[0].length + grd.length) * 2 - 1) { //Diagonal(/)
        let row = 0;
        let col = i - (grd[0].length + grd.length);
        if (col > grd[0].length - 1) {
          row += col - (grd[0].length - 1);
          col = grd[0].length - 1;
        }
        col -= strings[i].indexOf(word);
        row += strings[i].indexOf(word);
        for (let j = 0; j < word.length; j++) {
          foundWords[row + j][col - j] = 1;
        }
      } else { //Diagonal(\)
        let row = 0;
        let col = 3 * grd[0].length - i + 2 * grd.length - 2;
        if (col < 0) {
          row -= col;
          col = 0;
        }
        col += strings[i].indexOf(word);
        row += strings[i].indexOf(word);
        for (let j = 0; j < word.length; j++) {
          foundWords[row + j][col + j] = 1;
        }
      }
    }
  }
  return found;
}

function draw() {
  let sizeW = w / grd[0].length;
  let sizeH = h / grd.length;
  textAlign(CENTER, CENTER);
  textSize(sizeH - 2);
  for (let i = 0; i < grd.length; i++) {
    for (let j = 0; j < grd[i].length; j++) {
      fill(foundWords[i][j] === 1 ? 200 : 255)
      rect(sizeW * j, sizeH * i, sizeW, sizeH);
      fill(0);
      text(grd[i][j], sizeW * (j + .5), sizeH * (i + .5))
    }
  }
}