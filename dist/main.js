const render = function(data) {
    const source = $("#players-template").html()
    const template = Handlebars.compile(source)
    const newHTML = template({ player: data })
    $('#players-container').empty().append(newHTML)
}

$('#get-roster').on('click', function() {
    const teamName = $("#team-name-input").val()
    $.ajax({
        method: "get",
        url: `/teams/${teamName}`,
        success: function(resault) {
            render(resault)
        }
    })
})

$("#dream-team").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/dreamTeam",
        success: function(resault) {
            render(resault)
        }
    })
})

$("document").on("click", ".player", function() {
    const playerEL = $(this) // .something
    const player = {
        firstName: playerEL.data().firstName,
        lastName: playerEL.data().lastName,
        jersey: playerEL.data().jersey,
        pos: playerEL.find("p").last()
    }
    $.ajax({
        method: `POST`,
        url: `/rosters`,
        data: player,
        success: function(resault) {
            // done
        },
        error: function(xhr, text, err) {

        }
    })
})