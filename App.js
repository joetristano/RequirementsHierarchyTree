Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {					{
						Ext.define('USReqType',
						{
							override : 'Rally.ui.tree.TreeItem',
							getPillTpl : function()
							{
								var me = this;

								return Ext.create('Ext.XTemplate', '<div class="pill">', '<tpl if="this.canDrag()"><div class="icon drag"></div></tpl>', '{[this.getActionsGear()]}', '<div class="textContent ellipses">{[this.getFormattedId()]} {[this.getType(values)]}{[this.getSeparator()]}{Name}</div>', '<div class="rightSide">', '{[this.getRequirementType()]}', '</div>', '</div>',
								{
									canDrag : function()
									{
										return me.getCanDragAndDrop();
									},
									getActionsGear : function()
									{
										return '<div class="row-action icon"></div>';
									},
									getFormattedId : function()
									{
										return me.getRecord().getField('FormattedID') ? me.getRecord().render('FormattedID') : '';
									},
									getType : function(values)
									{
										return values.PortfolioItemType ? '(' + values.PortfolioItemType._refObjectName + ')' : '';
									},
									getRequirementType : function()
									{
										return me.getRecord().getField('RequirementType') ? me.getRecord().render('RequirementType') : '';
									},
									getSeparator : function()
									{
										return this.getFormattedId() ? ' - ' : '';
									}
								});
							}
						});
						this.add(
						{
							xtype : 'container',
							autoScroll : true,
							height : '100%',
							items : [
							{
								xtype : 'rallytree',
								childModelTypeForRecordFn : function()
								{
									return 'User Story';
								},
								parentAttributeForChildRecordFn : function()
								{
									return 'Parent';
								},
								canExpandFn : function(record)
								{
									return record.get('Children') && record.get('Children').length;
								},
								enableDragAndDrop : true,
								dragThisGroupOnMeFn : function(record)
								{
									if(record.get('_type') === 'hierarchicalrequirement')
									{
										return 'hierarchicalrequirement';
									}
								},
								listeners :
								{
									beforerecordsaved : function(record, newParentRecord, eOpts)
									{
										var parentType = newParentRecord.get('RequirementType');
										var myType;

										switch (parentType)
										{
											case 'Investment Theme':
												myType = 'Business Epic';
												break;
											case 'Business Epic':
											case 'Architectural Epic':
											case 'Design Epic':
												myType = 'Feature (CRD)';
												break;
											case 'Feature (CRD)':
												myType = 'User Story (PRS)';
												break;
											case 'User Story (PRS)':
												myType = 'Low Level User Story (subPRS)';
												break;
										}
										record.set('RequirementType', myType);
										record.save();
									},
									scope : this
								}
							}]

						});
					}
});
