#include <iostream>
using namespace std;

int main()
{
    int n;
    cout<<"Enter the number n:";
    cin>>n;
    for( int row =1 ; row<=(2*n-1) ; row ++)
    {
        for(int col =1 ; col<=(2*n-(2*row-2))/2; col++ )
        {
            cout<<"*";
        }
        for(int col =1 ; col<=2*row-2 ; col++)
        {
            cout<<" ";
        } 
        for(int col =1 ; col<=(2*n-(2*row-2))/2; col++ )
        {
            cout<<"*";
        }
        cout<<endl;

    }
    
}