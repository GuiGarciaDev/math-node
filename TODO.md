features:
[] Add precision properties in the operation nodes like ADD to control how many cases we want.
[] Improve design of graphs.
[] Inside the input of some operation nodes, implement a almost hidden label to round the output number like this 0,00078 ~ 0. the ~ 0 almost not visible.
[] Create the presets feature with a button in the header to save the current state of flowcanvas as a new preset. Allow user to load presets. (Maybe a dropdown in the presets button in the toolbar with option like navigate presets and save/create preset)

fixes:
[] Make the nodes not draggable when entry input is focused.
[] Graph labels are not aligned with the XY axis.

working:
[] Fix style of inspector sheet
[] Fix scissors mode

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
[x] Add more types of nodes in the app: superior power root, log ln, trigonometric, constants (pi, e, etc), logical operators (< > <= >= ===)
[x] Add tailwind in the project and refactor the components to use it. Also create a file with all types of typography and colors to be easy to check it.
[x] Fix the design of undo and redo buttons.
[x] Improve the design of the left sidebar when it is short mode.
[x] Create workflows to save user work, so they can save, reload, delete or create new workflows as necessary.
[x] Remove auto focus in nodes input when open a workflow.
[x] The viewport state is saving from the last workflow visit. For example, if the user enter in workflow 1 and then exit, the viewport state will be saved. Then, if he visit another workflow, the viewport will be in the same position as he leaved workflow 1. We need to sabe viewport state for every workflow or just adjust the viewport position to fit nodes.
[x] Add a button to restart node stats after run the pipeline.
[x] After select one node, place a button out and at the top of the node to allow the user run the pipeline from this node.
[x] Allow user change the name of the aggrouped nodes when double click in the group node or through a button in the context menu
