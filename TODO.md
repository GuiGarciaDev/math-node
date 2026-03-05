features:
[] Add precision properties in the operation nodes like ADD to control how many cases we want.
[] Improve design of graphs.
[] Add tailwind in the project and refactor the components to use it. Also create a file with all types of typography and colors to be easy to check it.

[] Add more types of nodes in the app:
superior power root
log ln
trigonometric
constants (pi, e, etc)
logical operators (< > <= >= ===)

fixes:
[] Fix the design of undo and redo buttons.
[] Graph labels are not aligned with the XY axis.
[] Improve the design of the left sidebar when it is short mode.

Completed:
[x] Number node dont accept number with decimal case and the execution causes error. The sidebar value input of the node accepts "." or "," but it throw "invalid number" error after execution.
[x] Plot graph have a width less than required and it cut part of the right side of the node.
[x] The node connection remove button in the middle of the edge should hidde the edge path under the button. It will cause a cool effect like the edge path passes "rouding" the circle and then following the other path trought the target.
[x] Remove the hover bottom-left sliding animation from handles.
[x] Include labels in the left of the output handles and in the right for input handles. (give a image to model for better understanding)
[x] Add a toolbar like krea.ai has in the node edition
[x] Right mouse button click in the nodes should add a context menu with options like delete, duplicate, etc.
[x] Add multiple nodes selection.
[x] Add group multiple nodes togeter feature.
[x] Make the left side bar support toggle hide.
[x] Node edges must have the handle color.
[x] Multiple selection with holding shift key and clicking in other nodes arent working.
[x] Context menu isnt opening when multiple nodes are selected.
[x] Scissors feature isnt cutting the node conenctions. We must change it to drag a line instead of an area.
[x] Add undo and redo
