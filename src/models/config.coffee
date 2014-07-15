module.exports =
  schema :
    name : 
      type : String
      require : true
    point : 
      interval : Number
    type : String
    date :
      start : String
      end : String
    stats : [
      {
        category : String
        key : []
      }
    ]
  indexes : [
    {
      id : 1
      name : 1
    }
    {
      id : 1
      address : 1
    }
  ]