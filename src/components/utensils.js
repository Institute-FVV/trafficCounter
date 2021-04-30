// function which allows to insert object at at given index
Array.prototype.insert = function ( index, item ) {
    this.splice( index, 0, item );
};