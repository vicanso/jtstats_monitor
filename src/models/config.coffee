module.exports =
  name : 'stats_config'
  schema :
    creator : 
      type : String
      require : true
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
        keys : []
      }
    ]
  indexes : [
    {
      name : 1
    }
  ]