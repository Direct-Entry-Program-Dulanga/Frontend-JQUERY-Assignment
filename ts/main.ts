import $ from 'jquery';
import '../img/trash.png';

$('#txt-id').trigger('focus');

$('#btn-save').on('click', () => {
    const txtId = $('#txt-id');
    const txtName = $('#txt-name');
    const txtAddress = $('#txt-address');

    const id = txtId.val() as string;
    const name = txtName.val() as string;
    const address = txtAddress.val() as string;

    let valid = true;


    // $('#txt-id, #txt-name, #txt-address').parent().removeClass('invalid');

    // if(!/^C\d{3}$/.test(id.trim())){
    //     txtId.parent().addClass('invalid').trigger('select');
    //     valid = false;
    // }
    // if(!/[A-Za-z .]{3,}/.test(name)){
    //     txtName.parent().addClass('invalid').trigger('select');
    //     valid = false;
    // }
    // if(!(/[A-Za-z .]/.test(address) && address.length > 3)){
    //     txtAddress.parent().addClass('invalid').trigger('select');
    //     valid = false;
    // }

    // if(!valid) return;

    const rowHtml = `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${address}</td>
            <td><div class="trash"></div></td> 
        </tr>
    `;

    $('#tbl-customers tbody').append(rowHtml);
    showOrHideTfoot();

    $('#tbl-customers tbody tr').off('click').on('click', function() {
          $('#tbl-customers tbody tr').removeClass('selected');
          $(this).addClass('selected');

          const id = $(this).find("td:first-child").text();
          const name = $(this).find("td:nth-child(2)").text();
          const address = $(this).find("td:nth-child(3)").text();

          $("#tbl-customers tbody tr").removeClass("selected");
          $(this).addClass('selected');
    });


    $(".trash").off('click').on('click', (eventData) => {
        if(confirm('Are you sure to delete ?')){
            $(eventData.target).parents("tr").fadeOut(500, function(){
                $(this).remove();
                showOrHideTfoot();
            });
        }
    });


});




function showOrHideTfoot(){
    ($('#tbl-customers tbody tr').length > 0)? $('#tbl-customers tfoot').hide(): $('#tbl-customers tfoot').show();
}