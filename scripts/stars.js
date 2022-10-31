$(".star1").hover(
    function () {
      $(this).addClass("fas");
    },
    function () {
      $(this).removeClass("fas");
    }
  );
  $(".star2").hover(
    function () {
        $(".star1").addClass("fas");
      $(this).addClass("fas");
    },
    function () {
        $(".star1").removeClass("fas");
      $(this).removeClass("fas");
    }
  );
  $(".star3").hover(
    function () {
        $(".star1").addClass("fas");
      $(".star2").addClass("fas");
      $(this).addClass("fas");
    },
    function () {
        $(".star1").removeClass("fas");
      $(".star2").removeClass("fas");
      $(this).removeClass("fas");
    }
  );
  $(".star4").hover(
    function () {
        $(".star1").addClass("fas");
      $(".star2").addClass("fas");
      $(".star3").addClass("fas");
      $(this).addClass("fas");
    },
    function () {
        $(".star1").removeClass("fas");
      $(".star2").removeClass("fas");
      $(".star3").removeClass("fas");
      $(this).removeClass("fas");
    }
  );
  $(".star5").hover(
    function () {
        $(".star1").addClass("fas");
      $(".star2").addClass("fas");
      $(".star3").addClass("fas");
      $(".star4").addClass("fas");
      $(this).addClass("fas");
    },
    function () {
        $(".star1").removeClass("fas");
      $(".star2").removeClass("fas");
      $(".star3").removeClass("fas");
      $(".star4").removeClass("fas");
      $(this).removeClass("fas");
    }
  );
  