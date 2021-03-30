import _ from 'lodash'

export default function transformToTree(
  arr,
  idKey: string = 'id',
  parentKey: string = 'parentId'
) {
  var nodes = {}
  return arr.filter(function (obj) {
    var id = obj[idKey],
      parentId = obj[parentKey]

    nodes[id] = _.defaults(obj, nodes[id], { children: [] })
    parentId &&
      (nodes[parentId] = nodes[parentId] || { children: [] })['children'].push(
        obj
      )

    return !parentId
  })
}
