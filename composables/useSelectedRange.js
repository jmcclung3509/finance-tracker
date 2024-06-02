import {
    sub,
    differenceInDays,
  } from "date-fns";

  export const useSelectedRange = (selectedRange) => {
    console.log(selectedRange, 'selectedRange')
 const dateRange =differenceInDays(new Date(selectedRange.end), new Date(selectedRange.start))
    const current = computed(() => {
      if (selectedRange && selectedRange.start && selectedRange.end) {
     
        return {
          from: selectedRange.start,
          to: selectedRange.end,
          dateRange
        };
      }
      return null; // Handle null or undefined case if needed
    });
  
    const previous = computed(() => {
      if (selectedRange && selectedRange.start && selectedRange.end) {
       
  
        return {
            from: sub(selectedRange.start, dateRange),
            to: sub(selectedRange.end, dateRange),
        };
      }
      return null; // Handle null or undefined case if needed
    });
  
    // watch(selectedRange, (newVal) => {
    //   console.log('selectedRange updated:', newVal);
    // });
  
    console.log(dateRange, 'dateRange');
  console.log(current.value, 'current', previous.value, 'previous')
    return { current, previous };
  };