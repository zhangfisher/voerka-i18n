
{
    this.writable &&
      <span style="float: right" on-click={(e)=>{e.stopPropagation()}}>
        {/*<a><action-tip type="plus" :title="绑定事件"></action-tip></a>*/}
        <a {...{ on: { click: () => this.bind(item) } }}><a-tooltip title="添加事件"><IconFont type="icon-tianjia"></IconFont></a-tooltip></a>
        <a {...{ on: { click: () => this.edit(item) } }}><a-tooltip title="编辑事件集"><a-icon type="edit"></a-icon></a-tooltip></a>
        <a {...{ on: { click: () => this.delete(item) } }}><a-tooltip title="删除事件集"><a-icon type="delete"></a-icon></a-tooltip></a>
      </span>
  }