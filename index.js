// uses createData function to create an array of
// 1,000,000 emails addresses
const emails = createData(['rob', 'elvis', 'suzie', 'james', 'nate', 'heather', 'linda', 'jim', 'syd', 'taylor', 'peter', 'andrew', 'ada', 'reed'], 100000, 'gmail');

//logging the email addresses since painting it to the DOM would require a ton of memory
console.log(`Check this out, it's 1M email addresses`, emails);

const startFunctionTime = new Date();
var removeDups = removeDuplicates(emails);
const endFunctionTime = new Date();
const executionTime = endFunctionTime.getMilliseconds() - startFunctionTime.getMilliseconds();

// Creates DOM for DeDuped Lists unordered list
createAndAppendDOM({
  htmlData: removeDups,
  attrs: { class: 'email' },
  tag: 'li',
  id: 'emails'
});


//Unit Testing
assert(!hasDuplicates(removeDups),  'removeDuplicates Test: there are no duplicates in this array', 'removeDuplicatesTest: there are duplicates in this array');
assert(executionTime < 1000, `removeDuplicates Test: Function took ${executionTime}ms to execute. Nice!`, 'removeDuplicatesTest: removeDuplicates Function took ${executionTime}ms to execute.  Better luck next time.' );

/**
  sets up a assert function used for unit testing

  params: testOutcome {Boolean}
  params: testDescription {String}
  params: 'errorMsg' {String} *optional
*/
function assert(testOutcome, testDescription, errorMsg) {
  const msg = testOutcome ? testDescription:errorMsg || '';

  createAndAppendDOM({
    htmlData: [msg],
    attrs: { class: testOutcome ? 'pass':'fail' },
    tag:'li',
    id: 'test'
  });
}

/**
  filters based on the first instance of an item in the
  arr (i.e. indexOf the arr) if the second instance of
  an item comes up the index will not equal the first
  indexOf that item and thus will not pass the filter test

  params: arr {Array}
*/
function removeDuplicates(arr) {
  let deDuped = arr.filter(function(item, index) {
    return arr.indexOf(item) === index;
  })

  // option 2 would use a forEach to loop through
  // the originial array and push into a container
  // array by checking if an item in the original array
  // does not exist in the container array.
  // about 10ms slower than the filter method above
  /*let deDuped = [];
  arr.forEach(function(item) {
    if(deDuped.indexOf(item) < 0) {
      deDuped.push(item);
    }
  })*/
  return deDuped;
};


/**
  Checks for duplicates in an array
  Used in the testing suite to check
  if array of emails has any duplicates

  params: arr {Array}
*/
function hasDuplicates(arr) {
  //returns true if the item[x] is not eq to the lastIndexOf that item
  for(var x = 0; x <  arr.length; x++) {
    if(x !== arr.lastIndexOf(arr[x])) {
      return x !== arr.lastIndexOf(arr[x]);
    }
  }
  return;
};

/**
Helper function to create DOM nodes.

params: options {Object}
  options: {
    htmlData: {Array}
    tag: {string}
    id {string} *optional
    attrs {Object} *optional
  }
*/
function createAndAppendDOM(options) {
  options.htmlData.forEach(function(item) {
    var node = document.createElement(options.tag);
    var val;

    if(options.attrs) {
      for(val in options.attrs) {
        node.setAttribute(val, options.attrs[val]);
      }
    }

    node.innerHTML = item;

    if (options.id) {
      document.getElementById(options.id).appendChild(node);
    } else {
      document.body.appendChild(node);
    }
  })
};

/** Helper function to create an array of email data

params: arr {Array} //an array of strings used as basis to create the iterated  collector array
params: iterator {Number}
params: opt_str {String} *optional
*/
function createData(arr, iterator, opt_str) {
  let collector = [];
  for (var x=0; x<iterator; x++) {
    var randomNumber = Math.floor(Math.random() * arr.length);
    collector.push(`${arr[randomNumber]}@${opt_str}.com`);
  }

  return collector;
};
