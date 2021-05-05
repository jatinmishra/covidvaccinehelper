$('#searchContainer').hide();
$('#loader').hide();

function setupListner() {
    $('#centerList').on('click-row.bs.table', function (row, $element, field) {
        console.log(row);
        console.log($element);
        console.log(field);
        showSlotDetails($element);
    });
}

function searchVaccineCenters() {
    $('#loader').show();
    if (document.getElementById("pincode").value && document.getElementById("dateTxt").value) {
        setupListner();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 400) {
                $('#backToSearch').show();
                $('#loader').hide();
                alert('Invalid Search parameters.');
            }
            if (this.readyState == 4 && this.status == 200) {
                $('#backToSearch').show();
                $('#main').hide();
                $('#loader').hide();
                var obj = this.responseText;
                var json = JSON.parse(obj);
                if (json.centers.length == 0) {
                    $('#header').text('No centers available for the entered search data.');
                }
                else {
                    $('#centerList').bootstrapTable('destroy');
                    $('#centerList').bootstrapTable({
                        data: json.centers
                    });
                    $('#searchContainer').show();
                    $('#availableSessions').hide();
                }

            }
        };

        var pin = document.getElementById("pincode").value;
        var date = document.getElementById("dateTxt").value;
        var yyyy = date.slice(0, 4)
        var mm = date.slice(5, 7)
        var dd = date.slice(8, 10)

        xhttp.open("GET", "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" + pin + "&date=" + dd + "-" + mm + "-" + yyyy, true);
        xhttp.send();
    }
    else {
        $('#loader').hide();
        alert('Please enter all the search parameters.')
    }
}

function showSlotDetails(data) {
    $('#availableSessions').show();
    if (data && data.sessions.length > 0) {
        $('#centerSessionList').show();
        $('#sessionCenterID').text('Available Sessions in Center ' + data.name + ' ID: ' + data.center_id);
        $('#centerSessionList').bootstrapTable('destroy');
        $('#centerSessionList').bootstrapTable({
            data: data.sessions
        });

        var target = $('#availableSessions');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
    else {
        $('#centerSessionList').hide();
        $('#sessionCenterID').text('Sorry, there are no seesions available sessions in Center ' + data.name + ' ID: ' + data.center_id);
    }
}

function showMain() {
    $('#loader').hide();
    $('#backToSearch').hide();
    $('#searchContainer').hide();
    $('#main').show();
    $('#header').text('Covid Vaccine Helper');
}