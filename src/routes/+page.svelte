<script>
  import FluentNumberSymbol16Filled from '~icons/fluent/number-symbol-16-filled';
  import Fa6SolidSackDollar from '~icons/fa6-solid/sack-dollar';
  import FaSolidDivide from '~icons/fa-solid/divide';
  import MingcuteBillFill from '~icons/mingcute/bill-fill';
  import PhPlayFill from '~icons/ph/play-fill';
  import GravityUiPercent from '~icons/gravity-ui/percent'

  const invalidNums = [null, undefined, 0, Infinity, NaN, ''];

  $: bill = null;
  $: billTotal = null;
  $: fromDate = null;
  $: throughDate = null;
  $: output = null;


  let checked = 'checked';
  $: splitTimes = null;
  $: isEvenSplit = checked === 'checked';
  $: splitType = isEvenSplit ? 'Even' : 'Uneven' ;
  $: splitValue = ( billTotal / splitTimes );

  function generateOutput() {
    const formattedFromDate = new Date(fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedThroughDate = new Date(throughDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    output = `${bill} ${formattedFromDate} - ${formattedThroughDate}`;
  }
  $: if(fromDate !== null && throughDate !== null) {
    generateOutput();
  }

  $: copied = false;
  $: tooltip = 'Copy to Clipboard';
  $: tootltipColor = copied ? 'success' : 'info';
  function copy(text) {
      return new Promise((resolve, reject) => {
          if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && navigator.permissions !== "undefined") {
              const type = "text/plain";
              const blob = new Blob([text], { type });
              const data = [new ClipboardItem({ [type]: blob })];
              navigator.permissions.query({name: "clipboard-write"}).then((permission) => {
                  if (permission.state === "granted" || permission.state === "prompt") {
                      navigator.clipboard.write(data)
                        .then (() => {
                          // alert('Copied to clipboard');
                          copied = true;
                          tooltip = 'Copied!';
                          resolve();
                        })
                        .catch((e) => {
                          copied = false;
                          tooltip = 'Failed to Copy Text';
                          reject(e);
                          alert("Error: ", e);
                          console.log(e);
                        });
                  }
                  else {
                      reject(new Error("Copy permission not granted!"));
                  }
              });
          }
          // else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
          //     var textarea = document.createElement("textarea");
          //     textarea.textContent = text;
          //     textarea.style.position = "fixed";
          //     textarea.style.width = '2em';
          //     textarea.style.height = '2em';
          //     textarea.style.padding = 0;
          //     textarea.style.border = 'none';
          //     textarea.style.outline = 'none';
          //     textarea.style.boxShadow = 'none';
          //     textarea.style.background = 'transparent';
          //     document.body.appendChild(textarea);
          //     textarea.focus();
          //     textarea.select();
          //     try {
          //         document.execCommand("copy");
          //         document.body.removeChild(textarea);
          //         resolve();
          //     }
          //     catch (e) {
          //         document.body.removeChild(textarea);
          //         reject(e);
          //     }
          // }
          else {
              alert("Error: ", e);
              reject(new Error("None of copying methods are supported by this browser!"));
          }
      });

  }

  function copyToClipboard(event) {
    copy(output);
  }

  $: persons = [];
  $: totalTallied = 0;
  $: percentLeft = 100;

  function personPercent() {
    for (let i = 0; i < splitTimes; i++) {
      persons[i] = { 'percentage': null, 'amount': null };
    }
  }

  function updatePersonPercent(percentage, i) {
    persons[i]['percentage'] = percentage;
    percentLeft -= percentage;

    let amount = (billTotal * (percentage / 100));
    persons[i]['amount'] = amount;
    totalTallied += amount;
  }

  function updateSplitType() {
    checked = checked === undefined ? 'checked' : undefined;
    isEvenSplit = checked === 'checked';
    splitType = isEvenSplit ? 'Even' : 'Uneven' ;
    personPercent();
  }
</script>

<div class="prose">
  <h1 class="m-4 text-center">Split! The! Bill!</h1>

  <div class="flex flex-col items-center gap-2">
    <div class="label flex-col">
      <span class="self-start label-text-alt">What's this for?</span>
      <select class="select select-bordered w-full max-w-xs" bind:value={bill} required>
        <option>⚡️🔌💡</option>
        <option>🗑️🚮</option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label for="fromDate" class="input input-bordered flex items-center gap-2">Bill Start Date:
        <input type="date" class="grow" id="fromDate" placeholder="Bill Start Date" bind:value={fromDate} required/>
      </label>
      <label for="throughDate" class="input input-bordered flex items-center gap-2">Throuh Date:
        <input type="date" class="grow" id="throughDate" placeholder="Bill End Date" bind:value={throughDate} required/>
      </label>
    </div>

    {#if output !== null}
      <div class="tooltip tooltip-{tootltipColor}" data-tip={tooltip}>
        <div on:click={copyToClipboard} readonly>
            {output}
        </div>
      </div>
    {/if}

    <br>
    <div class="flex flex-col gap-2">
      <label for="billtotal" class="input input-bordered flex items-center gap-2">
        <Fa6SolidSackDollar class="w-4 h-4 opacity-70"/>
        <input type="number" step="0.01" id="billtotal" class="grow" placeholder="Bill Total" bind:value={billTotal} required/>
      </label>

      <label for="split" class="input input-bordered flex items-center gap-2">
        <FaSolidDivide class="w-4 h-4 opacity-70"/>
        <input type="number" id="split" class="grow" placeholder="# of People" bind:value={splitTimes} required/>
      </label>

      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">{splitType} Split</span>
          <input type="checkbox" class="toggle toggle-success" name="splitType" on:click={updateSplitType} bind:checked={checked}/>
        </label>
      </div>


      {#if isEvenSplit === false && splitType == 'Uneven'}
        {#each persons as _, i}
          <label for="person{i}Percent" class="input input-bordered flex items-center gap-2">
            <GravityUiPercent class="w-4 h-4 opacity-70"/>
            <input type="number" id="person{i}Percent" class="grow" placeholder="Person {i + 1} Percentage" bind:value={persons[i]['percentage']} required on:change={updatePersonPercent(persons[i]['percentage'], i)}/>
            {#if !invalidNums.includes(persons[i]['amount'])}
              <div class="label">
                <span class="label-text-alt">Person {i + 1} Owes: ${persons[i]['amount']}</span>
              </div>
            {/if}
          </label>
        {/each}

        <p class="text-warning">
          {#if percentLeft > 0}
            Percent Left: {percentLeft}%
          {/if}
          {#if totalTallied !== billTotal}
            Remaining: ${(billTotal - totalTallied).toFixed(2)}
          {/if}
        </p>
      {/if}

      {#if billTotal !== null && splitTimes !== null && !invalidNums.includes(billTotal) && !invalidNums.includes(splitTimes) && isEvenSplit === true}
        <p>Each person pays: ${splitValue.toFixed(2)}</p>
      {/if}
    </div>
  </div>

</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
