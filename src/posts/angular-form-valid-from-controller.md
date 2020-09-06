---
title: "Angular Check if Form is Valid from Controller"
date: "2016-02-26"
path: "/angular-form-valid-from-controller"
---

The other day I was asked how you could check whether a form in Angular is valid from within the controller that corresponds to the form. Traditionally, this is how you would check the validity of your Angular form in the view, or your HTML:

```
<form name="superForm" ng-submit="submit(superForm)">
<!-- Add input fields here -->
</form>
```

To check form validity from within your controller, you can also do the following:

```
$scope.submit = function(form) {
if (form.$valid) {
// Do this or that if valid
}
};
```

Hopefully this helps someone. If you have any questions, please feel free to leave them in the comments section below.
