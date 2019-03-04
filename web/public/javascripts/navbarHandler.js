
function toggleNav() {
  if (document.getElementById("navbar").style.width == "250px") {
    document.getElementById("navbar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  } else {
    document.getElementById("navbar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
}
